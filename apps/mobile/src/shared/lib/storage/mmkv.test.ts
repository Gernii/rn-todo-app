// Isolate the storage module from react-native-mmkv so we can drive each
// instance's get/set/remove directly and reset the module-level per-user
// singleton between tests (see useLanguageStore.test.ts for the same
// mock-to-isolate pattern).
type MockInstance = {
	id: string;
	set: jest.Mock;
	getString: jest.Mock;
	remove: jest.Mock;
};

const mockCreatedInstances: MockInstance[] = [];

const mockCreateMMKV = jest.fn((config: { id: string }) => {
	const instance: MockInstance = {
		id: config.id,
		set: jest.fn(),
		getString: jest.fn(),
		remove: jest.fn(),
	};
	mockCreatedInstances.push(instance);
	return instance;
});

jest.mock("react-native-mmkv", () => ({
	createMMKV: (config: { id: string }) => mockCreateMMKV(config),
}));

type StorageModule = typeof import("./mmkv");

const loadModule = (): StorageModule => {
	let mod: StorageModule | undefined;
	jest.isolateModules(() => {
		mod = require("./mmkv");
	});
	if (!mod) throw new Error("Failed to load mmkv module");
	return mod;
};

describe("mmkv storage", () => {
	beforeEach(() => {
		mockCreatedInstances.length = 0;
		mockCreateMMKV.mockClear();
	});

	it("creates the app-wide global storage instance on load", () => {
		loadModule();

		expect(mockCreateMMKV).toHaveBeenCalledWith({ id: "app-global-storage" });
	});

	it("initializes a per-user storage namespaced by userId and returns it", () => {
		const { initializeUserStorage, getUserStorage } = loadModule();

		const created = initializeUserStorage("42");

		expect(mockCreateMMKV).toHaveBeenCalledWith({ id: "user-42-storage" });
		expect(getUserStorage()).toBe(created);
	});

	it("has no per-user storage until initialized and clears it back to null", () => {
		const { initializeUserStorage, getUserStorage, clearUserStorageInstance } =
			loadModule();

		expect(getUserStorage()).toBeNull();

		initializeUserStorage("42");
		expect(getUserStorage()).not.toBeNull();

		clearUserStorageInstance();
		expect(getUserStorage()).toBeNull();
	});

	it("delegates dynamicZustandStorage ops to the active per-user instance", () => {
		const { initializeUserStorage, dynamicZustandStorage } = loadModule();
		const userStorage = initializeUserStorage("42") as unknown as MockInstance;
		userStorage.getString.mockReturnValue("stored-value");

		dynamicZustandStorage.setItem("k", "v");
		expect(userStorage.set).toHaveBeenCalledWith("k", "v");

		expect(dynamicZustandStorage.getItem("k")).toBe("stored-value");
		expect(userStorage.getString).toHaveBeenCalledWith("k");

		dynamicZustandStorage.removeItem("k");
		expect(userStorage.remove).toHaveBeenCalledWith("k");
	});

	it("makes dynamicZustandStorage a safe no-op when no per-user instance is set", () => {
		const { dynamicZustandStorage } = loadModule();

		expect(dynamicZustandStorage.getItem("k")).toBeNull();
		// No instance to delegate to — these must not throw.
		expect(() => dynamicZustandStorage.setItem("k", "v")).not.toThrow();
		expect(() => dynamicZustandStorage.removeItem("k")).not.toThrow();
	});

	it("returns null from dynamicZustandStorage.getItem when the instance has no value", () => {
		const { initializeUserStorage, dynamicZustandStorage } = loadModule();
		const userStorage = initializeUserStorage("42") as unknown as MockInstance;
		userStorage.getString.mockReturnValue(undefined);

		expect(dynamicZustandStorage.getItem("missing")).toBeNull();
	});

	it("delegates globalZustandStorage ops to the app-wide instance", () => {
		const { globalZustandStorage } = loadModule();
		// The global instance is the one created on module load.
		const globalStorage = mockCreatedInstances.find(
			(i) => i.id === "app-global-storage",
		);
		if (!globalStorage) throw new Error("global storage not created");
		globalStorage.getString.mockReturnValue("stored-value");

		globalZustandStorage.setItem("k", "v");
		expect(globalStorage.set).toHaveBeenCalledWith("k", "v");

		expect(globalZustandStorage.getItem("k")).toBe("stored-value");
		expect(globalStorage.getString).toHaveBeenCalledWith("k");

		globalZustandStorage.removeItem("k");
		expect(globalStorage.remove).toHaveBeenCalledWith("k");
	});

	it("returns null from globalZustandStorage.getItem when there is no value", () => {
		const { globalZustandStorage } = loadModule();
		const globalStorage = mockCreatedInstances.find(
			(i) => i.id === "app-global-storage",
		);
		if (!globalStorage) throw new Error("global storage not created");
		globalStorage.getString.mockReturnValue(undefined);

		expect(globalZustandStorage.getItem("missing")).toBeNull();
	});
});

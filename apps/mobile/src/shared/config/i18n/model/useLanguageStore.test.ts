// Isolate the store from Paraglide's runtime and MMKV so we can drive the
// locale wiring and persistence directly (see language-select.test.tsx for the
// same mock-to-isolate pattern).
const mockSetLocale = jest.fn();
const mockOverwrite: {
	getLocale?: () => "en" | "vi";
	setLocale?: (locale: "en" | "vi") => void;
} = {};
jest.mock("@/shared/lib/i18n/runtime", () => ({
	setLocale: (...args: unknown[]) => mockSetLocale(...args),
	overwriteGetLocale: (fn: () => "en" | "vi") => {
		mockOverwrite.getLocale = fn;
	},
	overwriteSetLocale: (fn: (locale: "en" | "vi") => void) => {
		mockOverwrite.setLocale = fn;
	},
}));

const mockGlobalStorage = {
	getString: jest.fn(),
	set: jest.fn(),
};
jest.mock("@/shared/lib/storage/mmkv", () => ({
	globalStorage: mockGlobalStorage,
}));

type StoreModule = typeof import("./useLanguageStore");

const loadStore = (): StoreModule => {
	let mod: StoreModule | undefined;
	jest.isolateModules(() => {
		mod = require("./useLanguageStore");
	});
	if (!mod) throw new Error("Failed to load useLanguageStore");
	return mod;
};

describe("useLanguageStore", () => {
	beforeEach(() => {
		mockSetLocale.mockClear();
		mockGlobalStorage.getString.mockReset();
		mockGlobalStorage.set.mockClear();
		mockOverwrite.getLocale = undefined;
		mockOverwrite.setLocale = undefined;
	});

	it("defaults the language to en when nothing is saved in MMKV", () => {
		mockGlobalStorage.getString.mockReturnValue(undefined);

		const { useLanguageStore } = loadStore();

		expect(useLanguageStore.getState().language).toBe("en");
		expect(mockSetLocale).toHaveBeenCalledWith("en");
	});

	it("uses the saved vi language from MMKV", () => {
		mockGlobalStorage.getString.mockReturnValue("vi");

		const { useLanguageStore } = loadStore();

		expect(useLanguageStore.getState().language).toBe("vi");
		expect(mockSetLocale).toHaveBeenCalledWith("vi");
	});

	it("uses the saved en language from MMKV", () => {
		mockGlobalStorage.getString.mockReturnValue("en");

		const { useLanguageStore } = loadStore();

		expect(useLanguageStore.getState().language).toBe("en");
		expect(mockSetLocale).toHaveBeenCalledWith("en");
	});

	it("persists, switches the locale without reload, and updates state on setLanguage", async () => {
		mockGlobalStorage.getString.mockReturnValue(undefined);

		const { useLanguageStore } = loadStore();
		mockSetLocale.mockClear();

		// `setLanguage` is typed as `void` but is async internally, so cast to
		// await the pending locale switch before asserting on the new state.
		await (useLanguageStore
			.getState()
			.setLanguage("vi") as unknown as Promise<void>);

		expect(mockGlobalStorage.set).toHaveBeenCalledWith("app_lang", "vi");
		expect(mockSetLocale).toHaveBeenCalledWith("vi", { reload: false });
		expect(useLanguageStore.getState().language).toBe("vi");
	});

	it("teaches Paraglide to read the current locale via overwriteGetLocale", () => {
		mockGlobalStorage.getString.mockReturnValue("vi");

		loadStore();

		expect(mockOverwrite.getLocale?.()).toBe("vi");
	});

	it("updates the active locale when Paraglide calls overwriteSetLocale", () => {
		mockGlobalStorage.getString.mockReturnValue("en");

		loadStore();

		mockOverwrite.setLocale?.("vi");

		expect(mockOverwrite.getLocale?.()).toBe("vi");
	});
});

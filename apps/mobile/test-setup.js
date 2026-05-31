import "@testing-library/jest-native/extend-expect";

jest.mock("react-native-worklets", () =>
	require("react-native-worklets/src/mock"),
);

// 1. Mock React Native Reanimated
require("react-native-reanimated").setUpTests();

// 2. Mock MMKV storage
jest.mock("react-native-mmkv", () => {
	const createInstance = () => ({
		set: jest.fn(),
		getString: jest.fn(),
		getNumber: jest.fn(),
		getBoolean: jest.fn(),
		contains: jest.fn(),
		remove: jest.fn(),
		clearAll: jest.fn(),
		addOnValueChangedListener: jest.fn(),
	});
	return {
		createMMKV: jest.fn().mockImplementation(createInstance),
	};
});

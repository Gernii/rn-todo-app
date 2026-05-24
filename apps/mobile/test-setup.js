import "@testing-library/react-native/extend-expect";

// 1. Giả lập React Native Reanimated
require("react-native-reanimated").setUpTests();

// 2. Giả lập bộ nhớ MMKV
jest.mock("react-native-mmkv", () => {
	return {
		MMKV: jest.fn().mockImplementation(() => ({
			set: jest.fn(),
			getString: jest.fn(),
			getNumber: jest.fn(),
			getBoolean: jest.fn(),
			contains: jest.fn(),
			delete: jest.fn(),
			clearAll: jest.fn(),
			addOnValueChangedListener: jest.fn(),
		})),
	};
});

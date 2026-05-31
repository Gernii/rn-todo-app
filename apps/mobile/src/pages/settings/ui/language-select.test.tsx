import type { Option } from "@rn-primitives/select";
import { render, screen, userEvent } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { overwriteGetLocale } from "@/shared/lib/i18n/runtime";
import { LanguageSelect } from "./language-select";

// The store mock below replaces the module that normally wires Paraglide's
// locale getter, so configure it directly to keep message functions working.
overwriteGetLocale(() => "en");

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockSetLanguage = jest.fn();
jest.mock("@/shared/config/i18n/model/useLanguageStore", () => ({
	useLanguageStore: () => ({ language: "en", setLanguage: mockSetLanguage }),
}));

// `@/shared/ui/select` wraps @rn-primitives/select (ships untransformed JSX and
// is excluded from coverage). Mock it so we can render the trigger/items and
// drive `onValueChange` directly. `mockSelect.onValueChange` captures the latest
// handler passed by the component under test.
const mockSelect: { onValueChange?: (option: Option) => void } = {};
jest.mock("@/shared/ui/select", () => {
	const React = require("react");
	const { Pressable, Text, View } = require("react-native");
	return {
		Select: ({
			onValueChange,
			children,
		}: {
			onValueChange: (option: Option) => void;
			children: ReactNode;
		}) => {
			mockSelect.onValueChange = onValueChange;
			return React.createElement(View, null, children);
		},
		SelectTrigger: ({ children }: { children: ReactNode }) =>
			React.createElement(View, null, children),
		SelectValue: ({ placeholder }: { placeholder: string }) =>
			React.createElement(Text, null, placeholder),
		SelectContent: ({ children }: { children: ReactNode }) =>
			React.createElement(View, null, children),
		SelectGroup: ({ children }: { children: ReactNode }) =>
			React.createElement(View, null, children),
		SelectItem: ({
			label,
			value,
			disabled,
		}: {
			label: string;
			value: string;
			disabled?: boolean;
		}) =>
			React.createElement(
				Pressable,
				{
					testID: `language-option-${value}`,
					disabled,
					onPress: () => mockSelect.onValueChange?.({ value, label }),
				},
				React.createElement(Text, null, label),
			),
	};
});

describe("LanguageSelect", () => {
	beforeEach(() => {
		mockSetLanguage.mockClear();
	});

	it("renders the label and both language options", () => {
		render(<LanguageSelect />);

		expect(screen.getByText("Select language:")).toBeTruthy();
		expect(screen.getByTestId("language-option-vi")).toBeTruthy();
		expect(screen.getByTestId("language-option-en")).toBeTruthy();
	});

	it("sets the language to vi when the Vietnamese option is selected", async () => {
		render(<LanguageSelect />);

		await userEvent.press(screen.getByTestId("language-option-vi"));

		expect(mockSetLanguage).toHaveBeenCalledWith("vi");
	});

	it("sets the language to en when a non-vi option is selected", () => {
		render(<LanguageSelect />);

		// The English option is disabled (it is the current language), so the
		// select fires `onValueChange` directly rather than via a press.
		mockSelect.onValueChange?.({ value: "en", label: "English" });

		expect(mockSetLanguage).toHaveBeenCalledWith("en");
	});
});

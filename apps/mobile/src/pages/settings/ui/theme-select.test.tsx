import type { Option } from "@rn-primitives/select";
import { render, screen, userEvent } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { overwriteGetLocale } from "@/shared/lib/i18n/runtime";
import { ThemeSelect } from "./theme-select";

overwriteGetLocale(() => "en");

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockSetTheme = jest.fn();
jest.mock("uniwind", () => ({
	Uniwind: { setTheme: (theme: string) => mockSetTheme(theme) },
	useUniwind: () => ({ theme: "light" }),
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
					testID: `theme-option-${value}`,
					disabled,
					onPress: () => mockSelect.onValueChange?.({ value, label }),
				},
				React.createElement(Text, null, label),
			),
	};
});

describe("ThemeSelect", () => {
	beforeEach(() => {
		mockSetTheme.mockClear();
	});

	it("renders the label and both theme options", () => {
		render(<ThemeSelect />);

		expect(screen.getByText("Select theme:")).toBeTruthy();
		expect(screen.getByTestId("theme-option-light")).toBeTruthy();
		expect(screen.getByTestId("theme-option-dark")).toBeTruthy();
	});

	it("sets the theme to dark when the Dark option is selected", async () => {
		render(<ThemeSelect />);

		await userEvent.press(screen.getByTestId("theme-option-dark"));

		expect(mockSetTheme).toHaveBeenCalledWith("dark");
	});

	it("sets the theme to light when the Light option is selected", () => {
		render(<ThemeSelect />);

		// The Light option is disabled (it is the current theme), so the select
		// fires `onValueChange` directly rather than via a press.
		mockSelect.onValueChange?.({ value: "light", label: "Light" });

		expect(mockSetTheme).toHaveBeenCalledWith("light");
	});
});

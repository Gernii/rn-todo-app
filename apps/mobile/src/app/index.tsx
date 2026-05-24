import { Stack } from "expo-router";
import { MoonStarIcon, SunIcon } from "lucide-react-native";
import { View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";
import { Button } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";

const THEME_ICONS = {
	light: SunIcon,
	dark: MoonStarIcon,
};

const ThemeToggle = () => {
	const { theme } = useUniwind();

	function toggleTheme() {
		const newTheme = theme === "dark" ? "light" : "dark";
		Uniwind.setTheme(newTheme);
	}

	return (
		<Button
			onPressIn={toggleTheme}
			size="icon"
			variant="ghost"
			className="ios:size-9 web:mx-4 rounded-full"
		>
			<Icon as={THEME_ICONS[theme ?? "light"]} className="size-5" />
		</Button>
	);
};

export default function Index() {
	return (
		<>
			<Stack.Screen options={SCREEN_OPTIONS} />
			<View className="flex-1 items-center justify-center gap-8 p-4">
				<Text>Edit src/app/index.tsx to edit this screen.</Text>
			</View>
		</>
	);
}

const SCREEN_OPTIONS = {
	title: "Todo App",
	headerTransparent: true,
	headerRight: () => <ThemeToggle />,
};

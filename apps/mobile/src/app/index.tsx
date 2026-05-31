import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "@/shared/ui/text";

export default function Index() {
	return (
		<>
			<Stack.Screen options={SCREEN_OPTIONS} />
			<View className="flex-1 items-center justify-center gap-8 p-4">
				<Text>Edit src/app/index.tsx to edit this screen.</Text>
				<Link href="/settings">Settings</Link>
			</View>
		</>
	);
}

const SCREEN_OPTIONS = {
	title: "Todo App",
	headerTransparent: true,
};

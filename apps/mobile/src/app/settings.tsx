import { Stack } from "expo-router";
import { View } from "react-native";
import { SettingsPage } from "@/pages/settings";
import * as m from "@/shared/lib/i18n/messages";

const Page = () => {
	const SCREEN_OPTIONS = {
		title: m.stock_large_bullock_bake(),
		headerTransparent: false,
	};
	return (
		<>
			<Stack.Screen options={SCREEN_OPTIONS} />
			<View className="p-4">
				<SettingsPage />
			</View>
		</>
	);
};

export default Page;

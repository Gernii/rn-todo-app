import { View } from "react-native";

import { LanguageSelect } from "./language-select";
import { ThemeSelect } from "./theme-select";

export const Page = () => {
	return (
		<View className="flex gap-y-4">
			<ThemeSelect />
			<LanguageSelect />
		</View>
	);
};

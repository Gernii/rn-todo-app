import type { Option } from "@rn-primitives/select";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Uniwind, useUniwind } from "uniwind";
import * as m from "@/shared/lib/i18n/messages";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { Text } from "@/shared/ui/text";

export const ThemeSelect = () => {
	const themes = [
		{ label: m.shy_teal_alligator_sew(), value: "light" },
		{ label: m.key_bad_cowfish_greet(), value: "dark" },
	] as const;

	const { theme: currentTheme } = useUniwind();
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: Platform.select({
			ios: insets.bottom,
			android: insets.bottom + 24,
		}),
		left: 12,
		right: 12,
	};

	const selectedTheme = themes.find((t) => t.value === currentTheme);

	const onToggleTheme = (value: Option) => {
		const newTheme = value?.value === "light" ? "light" : "dark";
		Uniwind.setTheme(newTheme);
	};

	return (
		<View className="flex justify-between items-center flex-row">
			<Text>
				{m.home_heavy_larva_express({ name: m.free_fit_haddock_mop() })}:
			</Text>
			<Select value={selectedTheme} onValueChange={onToggleTheme}>
				<SelectTrigger>
					<SelectValue
						placeholder={m.home_heavy_larva_express({
							name: m.free_fit_haddock_mop(),
						})}
					/>
				</SelectTrigger>
				<SelectContent insets={contentInsets}>
					<SelectGroup>
						{themes.map((theme) => (
							<SelectItem
								key={theme.value}
								label={theme.label}
								value={theme.value}
								disabled={theme.value === currentTheme}
							/>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</View>
	);
};

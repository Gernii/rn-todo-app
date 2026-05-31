import type { Option } from "@rn-primitives/select";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguageStore } from "@/shared/config/i18n/model/useLanguageStore";
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

export const LanguageSelect = () => {
	const languages = [
		{ label: m.tense_yummy_clownfish_exhale(), value: "vi" },
		{ label: m.suave_legal_jan_jest(), value: "en" },
	];

	const { language: currentLanguage, setLanguage } = useLanguageStore();
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

	const selectedLanguage = languages.find((l) => l.value === currentLanguage);

	const toggleLanguage = (value: Option) => {
		const newLanguage = value?.value === "vi" ? "vi" : "en";
		setLanguage(newLanguage);
	};

	return (
		<View className="flex justify-between items-center flex-row">
			<Text>
				{m.home_heavy_larva_express({ name: m.late_best_lemming_bask() })}:
			</Text>
			<Select value={selectedLanguage} onValueChange={toggleLanguage}>
				<SelectTrigger>
					<SelectValue
						placeholder={m.home_heavy_larva_express({
							name: m.late_best_lemming_bask(),
						})}
					/>
				</SelectTrigger>
				<SelectContent insets={contentInsets}>
					<SelectGroup>
						{languages.map((language) => (
							<SelectItem
								key={language.value}
								label={language.label}
								value={language.value}
								disabled={language.value === currentLanguage}
							/>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</View>
	);
};

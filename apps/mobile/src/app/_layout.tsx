import "@/global.css";
import "temporal-polyfill/global";

import { PortalHost } from "@rn-primitives/portal";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useUniwind } from "uniwind";
import { useLanguageStore } from "@/shared/config/i18n/model/useLanguageStore";

export default function RootLayout() {
	const { theme } = useUniwind();
	const language = useLanguageStore((state) => state.language);

	const currentNavigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;

	return (
		<ThemeProvider value={currentNavigationTheme}>
			<StatusBar style={theme === "dark" ? "light" : "dark"} />
			{/*
			 * `key={language}` forces the whole navigator to remount when the
			 * locale changes. Screen titles/options are evaluated once at mount,
			 * so without this remount Paraglide strings already rendered (e.g.
			 * header titles) would keep the previous language. Do not remove.
			 */}
			<Stack key={language} />
			<PortalHost />
		</ThemeProvider>
	);
}

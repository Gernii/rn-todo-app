import { create } from "zustand";
import {
	overwriteGetLocale,
	overwriteSetLocale,
	setLocale,
} from "@/shared/lib/i18n/runtime";
import { globalStorage } from "@/shared/lib/storage/mmkv";

const LANGUAGE_KEY = "app_lang";

/**
 * Resolves the language to boot the app with.
 *
 * Priority: a previously persisted value in MMKV (`"en"` | `"vi"`) wins;
 * anything else (missing or unknown) falls back to `"en"`. This is the
 * intended hook point for device-locale detection (e.g. `expo-localization`)
 * later on.
 *
 * @returns The active locale code, either `"en"` or `"vi"`.
 */
const getInitialLanguage = () => {
	const savedLang = globalStorage.getString(LANGUAGE_KEY);
	if (savedLang === "en" || savedLang === "vi") return savedLang;

	// You can use expo-localization here to get the device language
	return "en";
};

/**
 * Single source of truth Paraglide reads from to resolve message strings.
 *
 * Paraglide's `getLocale()` must stay synchronous, so the current locale is
 * held in this module-level mutable variable rather than in React/Zustand
 * state. The store's `setLanguage` keeps it in sync via `setLocale()` (which
 * routes through the `overwriteSetLocale` handler below).
 */
let activeLocale: ReturnType<typeof getInitialLanguage> = getInitialLanguage();

// Teach Paraglide how to read the current language (sync getter over `activeLocale`).
overwriteGetLocale(() => activeLocale);

// Teach Paraglide what to do when `setLocale()` is called: mutate the singleton above.
overwriteSetLocale((newLocale: ReturnType<typeof getInitialLanguage>) => {
	activeLocale = newLocale;
});

type LanguageState = {
	language: string;
	setLanguage: (lang: "en" | "vi") => void;
};

/**
 * Zustand store that drives runtime language switching.
 *
 * Components subscribe to `language` to re-render on locale changes; call
 * `setLanguage` to switch. The store is the only supported way to change the
 * locale, since it coordinates persistence, Paraglide, and React state.
 */
export const useLanguageStore = create<LanguageState>((set) => ({
	language: getInitialLanguage(),
	/**
	 * Switches the active language. Performs three ordered steps:
	 *
	 * 1. Persist the choice to MMKV so it survives restarts.
	 * 2. Notify Paraglide via `setLocale` so future `m.*()` calls resolve in
	 *    the new locale. `reload: false` keeps the JS context alive (no hard
	 *    app reload) and lets React re-render instead.
	 * 3. Update store state, which re-renders subscribers (e.g. the root
	 *    `<Stack key={language}>` remounts to flush cached strings).
	 *
	 * @param lang - Target locale, `"en"` or `"vi"`.
	 */
	setLanguage: async (lang) => {
		// 1. Persist to device storage (MMKV)
		globalStorage.set(LANGUAGE_KEY, lang);

		// 2. Tell Paraglide to switch the language
		await setLocale(lang, { reload: false });

		// 3. Update state so React Native automatically re-renders the screens
		set({ language: lang });
	},
}));

// Module-level side effect: runs once on first import to seed Paraglide with
// the persisted/default locale before any screen renders.
setLocale(getInitialLanguage());

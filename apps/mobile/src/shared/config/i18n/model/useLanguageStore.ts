import { create } from "zustand";
import { setLocale } from "@/shared/lib/i18n/runtime";
import { globalStorage } from "@/shared/lib/storage/mmkv";

const LANGUAGE_KEY = "app_lang";

// Định nghĩa ngôn ngữ mặc định (đọc từ máy hoặc từ MMKV)
const getInitialLanguage = () => {
	const savedLang = globalStorage.getString(LANGUAGE_KEY);
	if (savedLang === "en" || savedLang === "vi") return savedLang;

	// Bạn có thể dùng expo-localization ở đây để lấy ngôn ngữ máy
	return "en";
};

type LanguageState = {
	language: string;
	setLanguage: (lang: "en" | "vi") => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
	language: getInitialLanguage(),
	setLanguage: (lang) => {
		// 1. Lưu xuống bộ nhớ máy (MMKV)
		globalStorage.set(LANGUAGE_KEY, lang);

		// 2. Báo cho Paraglide đổi ngôn ngữ
		setLocale(lang);

		// 3. Cập nhật state để React Native tự động re-render các màn hình
		set({ language: lang });
	},
}));

// Chạy một lần lúc khởi động app để set ngôn ngữ mặc định cho Paraglide
setLocale(getInitialLanguage());

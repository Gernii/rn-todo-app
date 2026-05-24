import { create } from "zustand";
import { storage } from "./mmkv"; // File cấu hình MMKV của bạn

// Định nghĩa ngôn ngữ mặc định (đọc từ máy hoặc từ MMKV)
const getInitialLanguage = () => {
	const savedLang = storage.getString("app_lang");
	if (savedLang) return savedLang;

	// Bạn có thể dùng expo-localization ở đây để lấy ngôn ngữ máy
	return "en";
};

interface LanguageState {
	language: string;
	setLanguage: (lang: "en" | "vi") => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
	language: getInitialLanguage(),
	setLanguage: (lang) => {
		// 1. Lưu xuống bộ nhớ máy (MMKV)
		storage.set("app_lang", lang);

		// 2. Báo cho Paraglide đổi ngôn ngữ
		setLanguageTag(lang);

		// 3. Cập nhật state để React Native tự động re-render các màn hình
		set({ language: lang });
	},
}));

// Chạy một lần lúc khởi động app để set ngôn ngữ mặc định cho Paraglide
setLanguageTag(getInitialLanguage());

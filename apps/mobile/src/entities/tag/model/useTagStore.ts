// file: src/entities/tag/model/useTagStore.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { globalZustandStorage } from "@/shared/lib/storage/mmkv";
import type { Tag } from "./types";

interface TagState {
	tags: Tag[];
	addTag: (name: string, color?: string) => void;
	updateTag: (id: string, name: string, color?: string) => void;
	deleteTag: (id: string) => void;
}

// Gợi ý: Tạo sẵn các thẻ mặc định cho User, đỡ mất công họ tự tạo từ đầu
const DEFAULT_SYSTEM_TAGS: Tag[] = [
	{ id: "tag-work", name: "Công việc", color: "#3B82F6", createdAt: 0 }, // Xanh dương
	{ id: "tag-personal", name: "Cá nhân", color: "#10B981", createdAt: 0 }, // Xanh lá
	{ id: "tag-urgent", name: "Khẩn cấp", color: "#EF4444", createdAt: 0 }, // Đỏ
];

export const useTagStore = create<TagState>()(
	persist(
		(set) => ({
			tags: DEFAULT_SYSTEM_TAGS, // Khởi tạo với các tag có sẵn

			addTag: (name, color) =>
				set((state) => ({
					tags: [
						...state.tags,
						{
							id: `tag-${Date.now()}`,
							name,
							color: color || "#6B7280", // Nếu ko truyền màu thì lấy màu xám mặc định
							createdAt: Date.now(),
						},
					],
				})),

			updateTag: (id, name, color) =>
				set((state) => ({
					tags: state.tags.map((t) =>
						t.id === id ? { ...t, name, color } : t,
					),
				})),

			// Lưu ý: Khi xóa Tag, bạn cần cẩn thận vì có thể có Todo đang dùng Tag này
			deleteTag: (id) =>
				set((state) => ({
					tags: state.tags.filter((t) => t.id !== id),
				})),
		}),
		{
			name: "tag-storage", // Tên key riêng biệt trong bộ nhớ MMKV
			storage: createJSONStorage(() => globalZustandStorage),
		},
	),
);

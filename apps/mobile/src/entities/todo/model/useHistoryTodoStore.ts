import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { globalZustandStorage } from "@/shared/lib/storage/mmkv";
import type { Todo } from "./types";

type HistoryState = {
	historyTodos: Todo[];
	addHistoryTodo: (todo: Todo) => void;
	clearHistory: () => void;
};

export const useHistoryTodoStore = create<HistoryState>()(
	persist(
		(set) => ({
			historyTodos: [],
			addHistoryTodo: (todo) =>
				set((state) => ({ historyTodos: [todo, ...state.historyTodos] })),
			clearHistory: () => set({ historyTodos: [] }),
		}),
		{
			name: "history-todo-storage",
			storage: createJSONStorage(() => globalZustandStorage),
		},
	),
);

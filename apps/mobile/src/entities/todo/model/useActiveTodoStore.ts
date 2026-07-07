import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { globalZustandStorage } from "@/shared/lib/storage/mmkv";
import type { Todo } from "./types";
import { useHistoryTodoStore } from "./useHistoryTodoStore";

type AddTodoParams = Pick<Todo, "title" | "description">;

type TodoState = {
	todos: Todo[];
	addTodo: (todo: AddTodoParams) => void;
	completeTodo: (id: string) => void;
	deleteTodo: (id: string) => void;
};

export const useActiveTodoStore = create<TodoState>()(
	persist(
		(set, get) => ({
			todos: [
				{
					id: "1",
					title: "Todo 1 with a very long title that should be truncated",
					description:
						"Description 1 with a very long description that should be truncated and should be truncated and should be truncated",
					isCompleted: false,
					createdAt: Date.now(),
					updatedAt: Date.now(),
					tagIds: [],
				},
				{
					id: "2",
					title: "Todo 2 with a very long title that should be truncated",
					description:
						"Description 2 with a very long description that should be truncated and should be truncated and should be truncated",
					isCompleted: false,
					createdAt: Date.now(),
					updatedAt: Date.now(),
					tagIds: [],
				},
			],
			addTodo: (item) => {
				const now = Date.now();
				const newTodo: Todo = {
					id: now.toString(),
					// TODO:
					tagIds: [],
					description: item.description,
					title: item.title,
					isCompleted: false,
					createdAt: now,
					updatedAt: now,
				};
				set((state) => ({
					todos: [...state.todos, newTodo],
				}));
			},
			completeTodo: (id) => {
				const todo = get().todos.find((t) => t.id === id);
				if (todo) {
					// Xóa khỏi Store Hiện tại
					set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
					// Đưa sang Store Lịch sử trước
					setTimeout(() => {
						useHistoryTodoStore.getState().addHistoryTodo({
							...todo,
							isCompleted: true,
						});
					}, 5000); // Đợi 5s cho hiệu ứng hoàn thành xong đã
				}
			},
			deleteTodo: (id) =>
				set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),
		}),
		{
			name: "active-todo-storage",
			storage: createJSONStorage(() => globalZustandStorage),
		},
	),
);

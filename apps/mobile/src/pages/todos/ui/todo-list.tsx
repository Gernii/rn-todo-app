import { View } from "react-native";
import { useActiveTodoStore } from "@/entities/todo";
import { TodoItem } from "./todo-item";

export const TodoList = () => {
	const { todos, completeTodo } = useActiveTodoStore();
	return (
		<View className="flex gap-y-2">
			{todos.map((todo) => (
				<TodoItem key={todo.id} {...todo} onToggle={completeTodo} />
			))}
		</View>
	);
};

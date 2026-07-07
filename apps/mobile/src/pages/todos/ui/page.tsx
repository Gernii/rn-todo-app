import { ScrollView } from "react-native";
import { CreateTodoButton } from "./create-todo-button";
import { TodoList } from "./todo-list";

export const Page = () => {
	return (
		<>
			<ScrollView>
				<TodoList />
			</ScrollView>
			<CreateTodoButton />
		</>
	);
};

import { View } from "react-native";
import type { Todo } from "@/entities/todo";
import { Card, CardContent } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog";
import { Text } from "@/shared/ui/text";

type TodoItemProps = Todo & {
	onToggle: (id: string) => void;
};

export const TodoItem = (props: TodoItemProps) => {
	const { title, description, isCompleted, onToggle } = props;
	return (
		<Dialog>
			<DialogTrigger>
				<Card>
					<CardContent className="flex gap-x-3 flex-row">
						<Checkbox
							checked={isCompleted}
							onCheckedChange={() => onToggle(props.id)}
							className="mt-1"
						/>
						<View className="flex gap-y-2 flex-col flex-1 min-w-0">
							<Text className="flex-1 line-clamp-1 font-semibold">{title}</Text>
							<Text className="flex-1 line-clamp-2 text-sm text-muted-foreground">
								{description}
							</Text>
						</View>
					</CardContent>
				</Card>
			</DialogTrigger>
			<DialogContent className="w-96">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

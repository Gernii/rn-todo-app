import { PlusIcon } from "lucide-react-native";
import * as m from "@/shared/lib/i18n/messages";
import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog";
import { Icon } from "@/shared/ui/icon";
import { CreateTodoForm } from "./create-todo-form";

export const CreateTodoButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="icon"
					// className="absolute bottom-8 right-6 h-14 w-14 rounded-full shadow-xl z-50"
					className="h-14 w-14 rounded-full shadow-xl z-50 absolute right-6 bottom-8"
				>
					<Icon as={PlusIcon} className="text-primary-foreground size-7" />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-96">
				<DialogHeader>
					<DialogTitle>{m.away_cute_cuckoo_explore()}</DialogTitle>
				</DialogHeader>
				<CreateTodoForm />
			</DialogContent>
		</Dialog>
	);
};

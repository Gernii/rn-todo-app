import * as DialogPrimitive from "@rn-primitives/dialog";
import { formOptions, useForm } from "@tanstack/react-form";
import { View } from "react-native";
import { useActiveTodoStore } from "@/entities/todo";
import * as m from "@/shared/lib/i18n/messages";
import { Button } from "@/shared/ui/button";
import { FieldError } from "@/shared/ui/field-error";
import { Input } from "@/shared/ui/input";
import { Text } from "@/shared/ui/text";
import { Textarea } from "@/shared/ui/textarea";
import {
	type CreateTodoFormValues,
	createTodoFormSchema,
} from "../model/schema";

const defaultUser: CreateTodoFormValues = {
	title: "",
	description: "",
};

const formOpts = formOptions({
	defaultValues: defaultUser,
	validators: {
		onChange: createTodoFormSchema,
	},
});

export const CreateTodoForm = () => {
	const addTodo = useActiveTodoStore((state) => state.addTodo);
	const { onOpenChange } = DialogPrimitive.useRootContext();

	const form = useForm({
		...formOpts,
		onSubmit: async ({ value }) => {
			addTodo({ ...value });
			onOpenChange(false);
		},
	});
	return (
		<View className="flex flex-col gap-y-2">
			<form.Field
				name="title"
				children={(field) => (
					<View>
						<Input
							aria-labelledby="title-label"
							placeholder={m.fine_weary_canary_nudge()}
							value={field.state.value}
							onChangeText={field.handleChange}
							onBlur={field.handleBlur}
							error={field.state.meta.errors.length > 0}
						/>
						{field.state.meta.errors.length > 0 && (
							<FieldError>{field.state.meta.errors[0]?.message}</FieldError>
						)}
					</View>
				)}
			/>
			<form.Field
				name="description"
				children={(field) => (
					<View>
						<Textarea
							aria-labelledby="description-label"
							placeholder={m.tense_good_grebe_dial()}
							value={field.state.value}
							onChangeText={field.handleChange}
							onBlur={field.handleBlur}
						/>
						{field.state.meta.errors.length > 0 && (
							<FieldError>{field.state.meta.errors[0]?.message}</FieldError>
						)}
					</View>
				)}
			/>
			<Button onPress={form.handleSubmit}>
				<Text>{m.loose_weary_sheep_flow()}</Text>
			</Button>
		</View>
	);
};

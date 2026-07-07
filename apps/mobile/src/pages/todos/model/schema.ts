import * as v from "valibot";
import * as m from "@/shared/lib/i18n/messages";

const titleSchema = v.pipe(
	v.string(),
	v.minLength(1, m.inner_pretty_chipmunk_edit()),
);

// (Tùy chọn) Form Schema tổng, dùng khi bạn muốn validate toàn bộ form lúc submit
export const createTodoFormSchema = v.object({
	title: titleSchema,
	description: v.string(),
});

export type CreateTodoFormValues = v.InferInput<typeof createTodoFormSchema>;

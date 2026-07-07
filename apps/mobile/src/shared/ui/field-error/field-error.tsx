import type { PropsWithChildren } from "react";
import { Text } from "../text";

export const FieldError = ({ children }: PropsWithChildren) => {
	return <Text className="text-sm text-red-500 pl-1 py-1">{children}</Text>;
};

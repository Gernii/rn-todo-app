import { Slot } from "@rn-primitives/slot";
import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "@/shared/lib/utils/cn";
import { ARIA_LEVEL, ROLE } from "./constants";
import { textVariants } from "./styles";
import type { TextVariantProps } from "./types";

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
	className,
	asChild = false,
	variant = "default",
	...props
}: React.ComponentProps<typeof RNText> &
	React.RefAttributes<typeof RNText> &
	TextVariantProps & {
		asChild?: boolean;
	}) {
	const textClass = React.useContext(TextClassContext);
	const Component = asChild ? Slot : RNText;
	return (
		<Component
			className={cn(textVariants({ variant }), textClass, className)}
			role={variant ? ROLE[variant] : undefined}
			aria-level={variant ? ARIA_LEVEL[variant] : undefined}
			{...props}
		/>
	);
}

export { Text, TextClassContext };

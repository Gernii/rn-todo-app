import { Pressable } from "react-native";
import { cn } from "@/shared/lib/utils/cn";
import { TextClassContext } from "@/shared/ui/text/text";
import { buttonTextVariants, buttonVariants } from "./styles";
import type { ButtonProps } from "./types";

/**
 * Pressable button styled via CVA `variant`/`size` axes.
 *
 * Wraps its children in a `TextClassContext.Provider` so any nested `Text`
 * (the label) automatically picks up the matching text styles for the chosen
 * variant/size — no need to style the label manually. The `disabled` prop also
 * dims the container.
 */
function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
			<Pressable
				className={cn(
					props.disabled && "opacity-50",
					buttonVariants({ variant, size }),
					className,
				)}
				role="button"
				{...props}
			/>
		</TextClassContext.Provider>
	);
}

export { Button };

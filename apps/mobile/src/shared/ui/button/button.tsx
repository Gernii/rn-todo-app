import { Pressable } from "react-native";
import { cn } from "@/shared/lib/utils/cn";
import { TextClassContext } from "@/shared/ui/text/text";
import { buttonTextVariants, buttonVariants } from "./styles";
import type { ButtonProps } from "./types";

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

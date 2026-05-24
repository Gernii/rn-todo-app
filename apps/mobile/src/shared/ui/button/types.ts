import type { VariantProps } from "cva";
import type { Pressable } from "react-native";
import type { buttonVariants } from "./styles";

export type ButtonProps = React.ComponentProps<typeof Pressable> &
	React.RefAttributes<typeof Pressable> &
	VariantProps<typeof buttonVariants>;

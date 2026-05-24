import type { VariantProps } from "cva";
import type { textVariants } from "./styles";

export type TextVariantProps = VariantProps<typeof textVariants>;

export type TextVariant = NonNullable<TextVariantProps["variant"]>;

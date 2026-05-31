import { Slot } from "@rn-primitives/slot";
import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "@/shared/lib/utils/cn";
import { ARIA_LEVEL, ROLE } from "./constants";
import { textVariants } from "./styles";
import type { TextVariantProps } from "./types";

/**
 * Propagates text styling classes from an ancestor down to descendant
 * {@link Text} components. A container (e.g. `Button`) sets a value via
 * `TextClassContext.Provider`, and any nested `Text` merges it into its own
 * `className`, so child text inherits the parent's typography without prop
 * drilling.
 */
const TextClassContext = React.createContext<string | undefined>(undefined);

/**
 * Themed text primitive built on React Native's `Text`.
 *
 * - Resolves the typographic `variant` through `textVariants` (CVA), then
 *   merges in any class inherited from {@link TextClassContext} and the local
 *   `className` (later values win via `cn`).
 * - Maps the `variant` to accessibility metadata (`role`, `aria-level`) using
 *   the `ROLE`/`ARIA_LEVEL` tables — e.g. `h1`–`h4` become headings.
 * - When `asChild` is `true`, renders via `Slot` and forwards props/styles to
 *   the single child element instead of emitting its own `<Text>` (useful for
 *   composing with `Link`, `Pressable`, etc.).
 *
 * @param asChild - Merge into the child element instead of rendering a `Text`.
 * @param variant - Typographic style key (`h1`, `p`, `muted`, …).
 */
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

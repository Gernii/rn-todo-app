import { Platform, type Role } from "react-native";
import type { TextVariant } from "./types";

/**
 * Maps a text `variant` to its accessibility `role`. Heading variants
 * (`h1`–`h4`) report as headings; `blockquote`/`code` only carry a role on web
 * (native has no equivalent). Variants not listed have no implicit role.
 */
export const ROLE: Partial<Record<TextVariant, Role>> = {
	h1: "heading",
	h2: "heading",
	h3: "heading",
	h4: "heading",
	blockquote: Platform.select({ web: "blockquote" as Role }),
	code: Platform.select({ web: "code" as Role }),
};

/**
 * Heading depth (`aria-level`) paired with the heading `role` above, so
 * `h1`–`h4` expose the correct level to assistive technologies.
 */
export const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
	h1: "1",
	h2: "2",
	h3: "3",
	h4: "4",
};

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names conditionally. `clsx` resolves conditional/array/object
 * inputs into a string, then `twMerge` dedupes conflicting Tailwind utilities
 * so later classes win (e.g. `cn("p-2", "p-4")` → `"p-4"`).
 *
 * @param inputs - Class values: strings, arrays, or conditional objects.
 * @returns The merged, conflict-resolved class string.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

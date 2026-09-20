import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Join class name parts into a single string, last conflicting Tailwind utility wins. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

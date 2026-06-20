import type { GlobalProvider } from "@ladle/react";

// Load the app's global stylesheet (Tailwind + DaisyUI theme) so stories render
// with the same styling as the real app. We import the Ladle-specific entry,
// which re-exports src/index.css and points Tailwind's content scan at src/
// (see .ladle/tailwind.css for why that's necessary under Ladle).
import "./tailwind.css";

export const Provider: GlobalProvider = ({ children }) => children;

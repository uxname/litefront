import type { GlobalProvider } from "@ladle/react";

// Load the app's global stylesheet (Tailwind + DaisyUI theme) so stories render
// with the same styling as the real app.
import "../src/index.css";

export const Provider: GlobalProvider = ({ children }) => children;

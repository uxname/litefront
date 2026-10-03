import type { Meta, StoryFn } from "@storybook/react-vite";
import { PageLoader } from "./page-loader";

export default { component: PageLoader } satisfies Meta<typeof PageLoader>;

export const Default: StoryFn = () => <PageLoader />;

export const WithLabel: StoryFn = () => <PageLoader label="Verifying…" />;

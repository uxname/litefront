import type { Meta, StoryFn } from "@storybook/react-vite";
import { PageLoader } from "./PageLoader";

export default { component: PageLoader } satisfies Meta<typeof PageLoader>;

export const Default: StoryFn = () => <PageLoader />;

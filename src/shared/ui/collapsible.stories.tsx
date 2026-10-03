import type { Meta, StoryFn } from "@storybook/react-vite";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

export default { component: Collapsible } satisfies Meta<typeof Collapsible>;

const Demo = ({ open }: { open?: boolean }) => (
  <Collapsible
    defaultOpen={open}
    className="w-72 rounded-lg border p-3 text-sm"
  >
    <CollapsibleTrigger className="font-medium">
      Debug information
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-2 text-muted-foreground">
      Path: /account
    </CollapsibleContent>
  </Collapsible>
);

export const Closed: StoryFn = () => <Demo />;

export const Open: StoryFn = () => <Demo open />;

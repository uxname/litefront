import type { Meta, StoryFn } from "@storybook/react-vite";
import { Button } from "../Button";
import { Card } from "./Card";

export default { component: Card } satisfies Meta<typeof Card>;

export const Basic: StoryFn = () => (
  <Card title="Account settings">
    <p className="text-sm text-base-content/70">
      Manage how your account behaves across the app.
    </p>
  </Card>
);

export const WithDescription: StoryFn = () => (
  <Card
    title="Billing"
    description="Update your payment method and review invoices."
  >
    <p className="text-sm text-base-content/70">No outstanding balance.</p>
  </Card>
);

export const WithActions: StoryFn = () => (
  <Card
    title="Team members"
    description="People with access to this workspace."
    actions={<Button size="sm">Invite</Button>}
  >
    <p className="text-sm text-base-content/70">3 members.</p>
  </Card>
);

export const BodyOnly: StoryFn = () => (
  <Card>
    <p className="text-sm text-base-content/70">
      A card with no header — just body content.
    </p>
  </Card>
);

export const ActionsWithoutTitle: StoryFn = () => (
  <Card actions={<Button size="sm">Refresh</Button>}>
    <p className="text-sm text-base-content/70">
      Header shows because actions are present.
    </p>
  </Card>
);

export const CustomBodyClassName: StoryFn = () => (
  <Card title="Edge to edge">
    <div className="bg-base-200 p-8 text-center text-sm">
      Custom body padding via bodyClassName.
    </div>
  </Card>
);

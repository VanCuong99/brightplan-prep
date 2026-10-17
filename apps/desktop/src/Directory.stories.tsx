import type { Meta, StoryObj } from "@storybook/react-vite";
import { Directory } from "./Directory";
const meta = { title: "Directory/People", component: Directory } satisfies Meta<
  typeof Directory
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FivePeople: Story = {};
export const Empty: Story = { args: { source: [] } };
export const LongAndDuplicateNames: Story = {
  args: {
    source: [
      {
        id: "1",
        name: "Alexandria Morgan Rivera With A Very Long Name",
        role: "Senior Frontend and Accessibility Engineer",
      },
      { id: "2", name: "Alex", role: "Engineer" },
      { id: "3", name: "Alex", role: "Designer" },
    ],
  },
};

export const SharedRoles: Story = {
  args: {
    source: [
      { id: "team-1", name: "Alex", role: "Engineer" },
      { id: "team-2", name: "Alex", role: "Engineer" },
      { id: "team-3", name: "Jamie", role: "Designer" },
    ],
  },
};

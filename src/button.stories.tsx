import { Button } from '@carbon/react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';

/**
 * An example story, kept as a reference for how to write stories in this
 * module. `Button` comes from Carbon, the design system O3 is built on.
 */
const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  args: {
    children: 'Click me',
    kind: 'primary',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'danger--tertiary', 'danger--ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { kind: 'secondary' },
};

export const Danger: Story = {
  args: { kind: 'danger' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

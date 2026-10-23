import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import Draw from './draw.component';

const meta: Meta<typeof Draw> = {
  title: 'Draw/Draw',
  component: Draw,
};

export default meta;

export const Default: StoryObj<typeof Draw> = {};

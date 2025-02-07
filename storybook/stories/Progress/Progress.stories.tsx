import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Progress } from '@jezvejs/react';
import './Progress.stories.scss';

export type Story = StoryObj<typeof Progress>;

const meta: Meta<typeof Progress> = {
    title: 'Components/Progress',
    component: Progress,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        className: 'w-500',
        value: 50,
    },
};

export const Styled: Story = {
    render: function Render() {
        return (
            <>
                <Progress className="w-500 green-progress thin-progress" value={25} />
                <Progress className="w-500 thick-progress square-progress" value={50} />
                <Progress className="w-500 border-progress" value={75} />
            </>
        );
    },
};

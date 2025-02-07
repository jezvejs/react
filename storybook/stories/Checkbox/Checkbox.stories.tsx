import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Checkbox } from '@jezvejs/react';
import './Checkbox.stories.scss';

const SmallCloseIcon = (props = {}) => (
    <svg {...props} className='checkbox__icon' viewBox='0 0 14 14'>
        <path
            d='M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z'
        />
    </svg>
);

type Story = StoryObj<typeof Checkbox>;

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        label: 'Checkbox',
    },
};

export const Checked: Story = {
    args: {
        checked: true,
        label: 'Checked',
    },
};

export const CustomIcon: Story = {
    args: {
        checked: true,
        checkIcon: SmallCloseIcon(),
        label: 'Custom icon',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
    },
};

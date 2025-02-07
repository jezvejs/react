import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';

import { ControlledSlider } from './components/ControlledSlider/ControlledSlider.tsx';
import { SlideContent } from './components/SlideContent/SlideContent.tsx';

import './Slider.stories.scss';

export type Story = StoryObj<typeof ControlledSlider>;

const meta: Meta<typeof ControlledSlider> = {
    title: 'Components/Slider',
    component: ControlledSlider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export type GetSliderItemsParams = {
    idPrefix?: string;
    itemsCount?: number;
};

const getSliderItems = (options: GetSliderItemsParams = {}) => {
    const {
        itemsCount = 3,
        idPrefix = 'slide',
    } = options;
    const res = [];

    for (let i = 1; i <= itemsCount; i += 1) {
        res.push({
            id: `${idPrefix}-${i}`,
            name: `${idPrefix}-${i}`,
            content: <SlideContent>{`Slide ${i}`}</SlideContent>,
        });
    }

    return res;
};

export const Default: Story = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
    },
};

export const Vertical: Story = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
        vertical: true,
    },
};

/**
 * Enabled \'allowMouse\' option
 */
export const AllowMouse: Story = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
        allowMouse: true,
    },
};

/**
 * Disabled 'allowTouch' option
 */
export const DisableTouch: Story = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
        allowTouch: false,
    },
};

/**
 * Disabled 'allowWheel' option
 */
export const DisableWheel: Story = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
        allowWheel: false,
    },
};

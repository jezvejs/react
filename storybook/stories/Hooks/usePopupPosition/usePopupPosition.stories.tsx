import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { PopupPosition } from '@jezvejs/react';

import { MenuPopup } from './components/MenuPopup/MenuPopup.tsx';
import './usePopupPosition.stories.scss';

type Story = StoryObj<typeof MenuPopup>;

const defaultDecorator = (StoryComponent: StoryFn) => (
    <div className="rel-container">
        <StoryComponent />
    </div>
);

const scrollDecorator = (StoryComponent: StoryFn) => (
    <div className="ref-scroller">
        <div className="ref-container">
            <StoryComponent />
        </div>
    </div>
);

const meta: Meta<typeof MenuPopup> = {
    title: 'Hooks/usePopupPosition',
    component: MenuPopup,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [defaultDecorator],
    tags: ['autodocs'],
    argTypes: {
        position: {
            control: 'radio',
            options: [...PopupPosition.positions],
        },
        allowFlip: {
            type: 'boolean',
        },
        allowHorizontalFlip: {
            type: 'boolean',
        },
        allowChangeAxis: {
            type: 'boolean',
        },
        scrollOnOverflow: {
            type: 'boolean',
        },
        allowResize: {
            type: 'boolean',
        },
        margin: {
            type: 'number',
        },
        screenPadding: {
            type: 'number',
        },
    },
};
export default meta;

export const Default: Story = {
    args: {
    },
};

export const ScrollParent: Story = {
    args: {
        position: 'top',
    },
    decorators: [scrollDecorator],
};

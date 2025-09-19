import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useState } from 'react';
import { useResizeObserver } from '@jezvejs/react';

import './useResizeObserver.stories.scss';

const ResizeDemo = () => {
    const [state, setState] = useState({
        fullScreenElement: {
            width: 0,
            height: 0,
        },
        fullHeightElement: {
            width: 0,
            height: 0,
        },
        halfWidthElement: {
            width: 0,
            height: 0,
        },
    });

    const fullScreenRef = useResizeObserver<HTMLDivElement>((entry) => {
        setState((prev) => ({
            ...prev,
            fullScreenElement: {
                ...prev.fullScreenElement,
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            },
        }));
    });

    const fullHeightRef = useResizeObserver<HTMLDivElement>((entry) => {
        setState((prev) => ({
            ...prev,
            fullHeightElement: {
                ...prev.fullHeightElement,
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            },
        }));
    });

    const halfWidthRef = useResizeObserver<HTMLDivElement>((entry) => {
        setState((prev) => ({
            ...prev,
            halfWidthElement: {
                ...prev.halfWidthElement,
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            },
        }));
    });

    return (
        <div className="resize-demo">
            <div ref={fullScreenRef} className="full-screen-block">
                Width: {state.fullScreenElement.width} Height: {state.fullScreenElement.height}
            </div>
            <div ref={fullHeightRef} className="full-height-block">
                Width: {state.fullHeightElement.width} Height: {state.fullHeightElement.height}
            </div>
            <div ref={halfWidthRef} className="half-width-block">
                Width: {state.halfWidthElement.width} Height: {state.halfWidthElement.height}
            </div>
        </div>
    );
};

type Story = StoryObj<typeof ResizeDemo>;

const meta: Meta<typeof ResizeDemo> = {
    title: 'Hooks/useResizeObserver',
    component: ResizeDemo,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
    },
};

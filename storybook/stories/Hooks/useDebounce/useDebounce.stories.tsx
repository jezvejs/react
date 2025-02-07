import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { DebounceOptions, useDebounce } from '@jezvejs/react';
import { useState } from 'react';

import { ActionButton } from '../../../common/Components/ActionButton/ActionButton.tsx';

import './useDebounce.stories.scss';

type DebouncedDemoProps = {
    ms: number;
    options?: DebounceOptions;
};

const DebouncedDemo: React.FC<DebouncedDemoProps> = (args) => {
    const {
        ms,
        options = {},
    } = args;

    const [state, setState] = useState({
        counter: 0,
    });

    const run = () => {
        setState((prev) => ({ ...prev, counter: prev.counter + 1 }));
    };

    const debounced = useDebounce(run, ms, options);

    const runDebouced = () => {
        if (!debounced) {
            return;
        }

        if ('run' in debounced) {
            debounced.run();
        } else {
            debounced();
        }
    };

    const cancelDebounced = () => {
        if (debounced && 'cancel' in debounced) {
            debounced.cancel();
        }
    };

    const cancelBtn = !!options?.cancellable && (
        <ActionButton title="Cancel" onClick={cancelDebounced} />
    );

    return (
        <div className="debounced-demo">
            <ActionButton title="Run" onClick={runDebouced} />
            {cancelBtn}
            <span>Callback run: {state.counter}</span>
        </div>
    );
};

type Story = StoryObj<typeof DebouncedDemo>;

const meta: Meta<typeof DebouncedDemo> = {
    title: 'Hooks/useDebounce',
    component: DebouncedDemo,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        ms: 500,
    },
};

export const Delay: Story = {
    args: {
        ms: 1000,
    },
};

export const Immediate: Story = {
    args: {
        ms: 500,
        options: {
            immediate: true,
        },
    },
};

export const Cancellable: Story = {
    args: {
        ms: 500,
        options: {
            cancellable: true,
        },
    },
};

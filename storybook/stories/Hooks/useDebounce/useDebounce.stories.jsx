// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useDebounce } from '@jezvejs/react';
import { useState } from 'react';

import { ActionButton } from '../../../Components/ActionButton/ActionButton.jsx';

import './useDebounce.stories.scss';

const DebouncedDemo = (args) => {
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

        if (debounced.run) {
            debounced.run();
        } else {
            debounced();
        }
    };

    const cancelDebounced = () => {
        if (debounced?.cancel) {
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

export default {
    title: 'Hooks/useDebounce',
    component: DebouncedDemo,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        ms: 500,
    },
};

export const Delay = {
    args: {
        ms: 1000,
    },
};

export const Immediate = {
    args: {
        ms: 500,
        options: {
            immediate: true,
        },
    },
};

export const Cancellable = {
    args: {
        ms: 500,
        options: {
            cancellable: true,
        },
    },
};

// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Input } from '@jezvejs/react';
import { useInputState } from '../../../common/hooks/useInputState.js';
import './Input.stories.scss';

const InputWithState = (props) => {
    const { inputProps } = useInputState(props);

    return (
        <Input {...inputProps} />
    );
};

export default {
    title: 'Input/Input',
    component: InputWithState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        value: '',
    },
};

export const Placeholder = {
    args: {
        placeholder: 'Input value',
    },
};

export const FullWidth = {
    args: {
        className: 'full-width',
    },
    parameters: {
        layout: 'fullscreen',
    },
};

export const Styled = {
    args: {
        className: 'styled',
        placeholder: 'Input correct value',
    },
};

export const Disabled = {
    args: {
        title: 'Disabled input',
        disabled: true,
    },
};

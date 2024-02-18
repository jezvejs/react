import { Input } from '@jezvejs/react';
import './Input.stories.css';

export default {
    title: 'Components/Input',
    component: Input,
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


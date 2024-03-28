// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DateInput } from '@jezvejs/react';
import { useState } from 'react';

export default {
    title: 'Input/DateInput',
    component: DateInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        value: '01.02.3456',
    },
    render: function Render(args) {
        const [state, setState] = useState({
            inputStatus: null,
            formStatus: null,
        });

        const onSubmit = (e) => {
            e.preventDefault();
            setState((prev) => ({
                ...prev,
                formStatus: 'Form submit event fired',
            }));
        };

        const onInput = (e) => {
            setState((prev) => ({
                ...prev,
                inputStatus: e.target.value,
            }));
        };

        return (
            <>
                <form style={{ marginBottom: '1rem' }} onSubmit={onSubmit}>
                    <DateInput {...args} onInput={onInput} />
                    <input type="submit" hidden />
                </form>
                <div>{state.inputStatus}</div>
                <div>{state.formStatus}</div>
            </>
        );
    },
};

export const Placeholder = {
    args: {
        placeholder: 'Input date',
    },
};

export const EnglishLocale = {
    args: {
        locales: ['en-US'],
    },
};

export const KoreanLocale = {
    args: {
        locales: ['ko-KR'],
    },
};

export const RussianLocale = {
    args: {
        locales: ['ru-RU'],
    },
};

export const EsLocale = {
    args: {
        locales: ['es'],
    },
};

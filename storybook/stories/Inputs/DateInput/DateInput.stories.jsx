// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DateInput } from '@jezvejs/react';
import { useState } from 'react';
import { SectionControls } from '../../../common/Components/SectionControls/SectionControls.jsx';

const TempInputDecorator = (Story) => (
    <div>
        <Story />
        <SectionControls>
            <input className="input tmp-input" type="text" />
        </SectionControls>
    </div>
);

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
                <form onSubmit={onSubmit}>
                    <DateInput {...args} onInput={onInput} />
                    <input type="submit" hidden />
                </form>
                <SectionControls>
                    <div>{state.inputStatus}</div>
                    <div>{state.formStatus}</div>
                </SectionControls>
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
        id: 'usLocaleInput',
        locales: ['en-US'],
    },
    decorators: [TempInputDecorator],
};

export const KoreanLocale = {
    args: {
        id: 'koLocaleInput',
        locales: ['ko-KR'],
    },
    decorators: [TempInputDecorator],
};

export const RussianLocale = {
    args: {
        id: 'ruLocaleInput',
        locales: ['ru-RU'],
    },
    decorators: [TempInputDecorator],
};

export const EsLocale = {
    args: {
        id: 'esLocaleInput',
        locales: ['es'],
    },
    decorators: [TempInputDecorator],
};

import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { DateInput } from '@jezvejs/react';
import { useState } from 'react';
import { SectionControls } from '../../../common/Components/SectionControls/SectionControls.tsx';
import { LocaleSelect } from '../../../common/Components/LocaleSelect/LocaleSelect.tsx';

const TempInputDecorator = (StoryComponent: StoryFn) => (
    <div>
        <StoryComponent />
        <SectionControls>
            <input className="input tmp-input" type="text" />
        </SectionControls>
    </div>
);

type Story = StoryObj<typeof DateInput>;

const meta: Meta<typeof DateInput> = {
    title: 'Input/DateInput',
    component: DateInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        value: '01.02.3456',
    },
    render: function Render(args) {
        const [state, setState] = useState({
            inputStatus: '',
            formStatus: '',
        });

        const onSubmit = (e: React.FormEvent<HTMLElement>) => {
            e.preventDefault();
            setState((prev) => ({
                ...prev,
                formStatus: 'Form submit event fired',
            }));
        };

        const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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

export const Placeholder: Story = {
    args: {
        placeholder: 'Input date',
    },
};

export const Locales: Story = {
    args: {
        id: 'localeInput',
        locales: ['en-US'],
    },
    decorators: [TempInputDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            locales: args.locales,
        });

        const onChangeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setState((prev) => ({
                ...prev,
                locales: [e.target.value],
            }));
        };

        return (
            <div>
                <div>
                    <DateInput {...args} locales={state.locales} />
                </div>
                <SectionControls>
                    <LocaleSelect id="localeSelect" onChange={onChangeLocale} />
                </SectionControls>
            </div>
        );
    },
};

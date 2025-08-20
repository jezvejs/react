import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useState } from 'react';
import { WeekDaySelect } from '@jezvejs/react';

import { SectionControls } from 'common/Components/SectionControls/SectionControls.tsx';
import { LocaleSelect } from 'common/Components/LocaleSelect/LocaleSelect.tsx';

import './WeekDaySelect.stories.scss';

export type Story = StoryObj<typeof WeekDaySelect>;

const meta: Meta<typeof WeekDaySelect> = {
    title: 'Menu/WeekDaySelect',
    component: WeekDaySelect,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
    },
};

export const Styled: Story = {
    args: {
        className: 'styled bold',
    },
};

export const MultiSelect: Story = {
    args: {
        className: 'styled bold',
        multiple: true,
        defaultItemType: 'button',
    },
};

/**
 * 'locales' property
 */
export const Locales: Story = {
    args: {
        locales: ['en-US'],
    },
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
                    <WeekDaySelect {...args} locales={state.locales} />
                </div>
                <SectionControls>
                    <LocaleSelect id="localeSelect" onChange={onChangeLocale} />
                </SectionControls>
            </div>
        );
    },
};

/**
 * Disabled checkbox
 */
export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

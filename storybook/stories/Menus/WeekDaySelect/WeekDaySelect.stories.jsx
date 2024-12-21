// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useState } from 'react';
import { WeekDaySelect } from '@jezvejs/react';

import { SectionControls } from '../../../common/Components/SectionControls/SectionControls.jsx';
import { LocaleSelect } from '../../../common/Components/LocaleSelect/LocaleSelect.jsx';

import './WeekDaySelect.stories.scss';

export default {
    title: 'Menu/WeekDaySelect',
    component: WeekDaySelect,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        label: 'WeekDaySelect',
    },
};

export const Styled = {
    args: {
        className: 'styled bold',
    },
};

export const MultiSelect = {
    args: {
        className: 'styled bold',
        multiple: true,
        defaultItemType: 'button',
    },
};

/**
 * 'locales' property
 */
export const Locales = {
    args: {
        locales: ['en-US'],
    },
    render: function Render(args) {
        const [state, setState] = useState({
            locales: args.locales,
        });

        const onChangeLocale = (e) => {
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

export const Disabled = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
    },
};

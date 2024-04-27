// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { WeekDaySelect } from '@jezvejs/react';
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

export const EnglishLocale = {
    args: {
        locales: ['en-US'],
    },
};

export const FranceLocale = {
    args: {
        locales: ['fr'],
    },
};

export const RussianLocale = {
    args: {
        locales: ['ru-RU'],
    },
};

export const Disabled = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
    },
};

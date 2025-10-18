import { DateInputComponents, DateInputPageComponents, DisabledInputButtonControlId } from './types.ts';

export const dateInputIds = [
    'defaultInput',
    'localeInput',
    'disabledDateInput',
];

export const disabledInputPageButtonsIds: DisabledInputButtonControlId[] = [
    'toggleEnableBtn',
    'changeValueBtn',
];

export const initialInputComponents: DateInputComponents = {
    defaultInput: null,
    localeInput: null,
    disabledDateInput: null,
};

export const initialComponents: DateInputPageComponents = {
    ...initialInputComponents,
    localeSelect: null,
    toggleEnableBtn: null,
    changeValueBtn: null,
};

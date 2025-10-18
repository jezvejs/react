import { DecimalInputComponents, DecimalInputPageComponents, DisabledInputButtonControlId } from './types.ts';

export const decimalInputIds = [
    'defaultInput',
    'digitsLimitInput',
    'minMaxDecInput',
    'integerInput',
    'positiveInput',
    'leadZerosInput',
    'disabledInput',
];

export const disabledInputPageButtonsIds: DisabledInputButtonControlId[] = [
    'toggleEnableBtn',
    'changeValueBtn',
];

export const initialInputComponents: DecimalInputComponents = {
    defaultInput: null,
    digitsLimitInput: null,
    minMaxDecInput: null,
    integerInput: null,
    positiveInput: null,
    leadZerosInput: null,
    disabledInput: null,
};

export const initialComponents: DecimalInputPageComponents = {
    ...initialInputComponents,

    toggleEnableBtn: null,
    changeValueBtn: null,
};

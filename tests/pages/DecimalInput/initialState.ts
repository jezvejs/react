import { DecimalInputPageState } from './types.ts';

export const initialState: DecimalInputPageState = {
    defaultInput: {
        value: '',
        visible: true,
        enabled: true,
    },
    digitsLimitInput: {
        value: '',
        visible: true,
        enabled: true,
    },
    minMaxDecInput: {
        value: '',
        visible: true,
        enabled: false,
    },
    integerInput: {
        value: '',
        visible: true,
        enabled: false,
    },
    positiveInput: {
        value: '',
        visible: true,
        enabled: false,
    },
    leadZerosInput: {
        value: '',
        visible: true,
        enabled: false,
    },
    disabledInput: {
        value: '',
        visible: true,
        enabled: false,
    },
    toggleEnableBtn: {
        title: 'Enable',
        visible: true,
        enabled: true,
        type: 'button',
    },
    changeValueBtn: {
        title: 'Change value',
        visible: true,
        enabled: true,
        type: 'button',
    },
};

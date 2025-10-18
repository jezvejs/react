import { DateInputPageState } from './types.ts';

export const initialState: DateInputPageState = {
    defaultInput: {
        value: '',
        visible: true,
        enabled: true,
    },
    localeInput: {
        value: '',
        visible: true,
        enabled: true,
    },
    localeSelect: {
        title: '',
        visible: true,
        enabled: true,
    },
    disabledDateInput: {
        value: '',
        visible: true,
        enabled: true,
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

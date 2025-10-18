import {
    Button,
    ButtonState,
    Input,
    InputState,
} from '@jezvejs/react-test';

export type DecimalInputPageId =
    'default'
    | 'digits-limit'
    | 'min-max'
    | 'integer'
    | 'only-positive'
    | 'leading-zeros'
    | 'disabled';

export type DecimalInputId =
    | 'defaultInput'
    | 'digitsLimitInput'
    | 'minMaxDecInput'
    | 'integerInput'
    | 'positiveInput'
    | 'leadZerosInput'
    | 'disabledInput';

export type DisabledInputButtonControlId =
    | 'toggleEnableBtn'
    | 'changeValueBtn';

export type DisabledDecimalInputId = 'disabledInput';
export type DisabledDateInputId = 'disabledDateInput';

export type DecimalInputPageComponentsIds =
    DecimalInputId
    | 'toggleEnableBtn'
    | 'changeValueBtn';

export type DecimalInputComponents = Record<DecimalInputId, Input | null>;

export type DecimalInputPageComponents = DecimalInputComponents & {
    toggleEnableBtn: Button | null;
    changeValueBtn: Button | null;
};

export type DecimalInputPageState = Record<DecimalInputId, InputState | null> & {
    toggleEnableBtn: ButtonState | null;
    changeValueBtn: ButtonState | null;
};

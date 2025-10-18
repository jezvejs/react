import {
    Button,
    ButtonState,
    Input,
    InputState,
} from '@jezvejs/react-test';
import { Locator } from '@playwright/test';

export type DateInputPageId =
    'default'
    | 'placeholder'
    | 'locales'
    | 'disabled';

export type DateInputId =
    | 'defaultInput'
    | 'localeInput'
    | 'disabledDateInput';

export type DisabledInputButtonControlId =
    | 'toggleEnableBtn'
    | 'changeValueBtn';

export type LocalesDateInputId = 'localeInput';

export type DisabledDateInputId = 'disabledDateInput';

export type DateInputPageComponentsIds =
    DateInputId
    | 'localeSelect'
    | DisabledInputButtonControlId;

export type DateInputComponents = Record<DateInputId, Input | null>;

export type DateInputPageComponents =
    DateInputComponents &
    Record<DisabledInputButtonControlId, Button | null> &
    {
        localeSelect: Locator | null;
    };

export type DateInputPageState =
    Record<DateInputId, InputState | null> &
    Record<DisabledInputButtonControlId, ButtonState | null> &
    {
        localeSelect: ButtonState | null;
    };

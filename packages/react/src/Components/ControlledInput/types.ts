import { InputProps } from '../Input/Input.tsx';

export type ControlledInputEvent =
    React.ChangeEvent<HTMLInputElement>
    | React.ClipboardEvent<HTMLInputElement>
    | React.CompositionEvent<HTMLInputElement>
    | React.FormEvent<HTMLInputElement>;

export interface ControlledInputProps extends InputProps {
    selectionStart?: number;
    selectionEnd?: number;
    handleValueProperty?: boolean;
    disableAutoFeatures?: boolean;
    isValidValue?: (value: string) => boolean;
    onValidateInput?: (e: ControlledInputEvent) => void;
    onValue?: (value: string, prev: string) => string;

    onSelectCapture?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}

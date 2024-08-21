/**
 * ColorInput component
 */
export interface ColorInputProps {
    id?: string;
    className?: string;
    inputId?: string;
    value?: string;
    colorProp?: string;
    form?: string;
    name?: string;
    tabIndex?: number;
    disabled?: boolean;

    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
}

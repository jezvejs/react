import {
    fixFloat,
    getAllowedDecimalPlaces,
    getDecimalPlaces,
    isMultipleLeadingZeros,
    isNumberString,
    trimDecimalPlaces,
} from '@jezvejs/number';

import { ControlledInput } from '../ControlledInput/ControlledInput.tsx';
import { ControlledInputProps } from '../ControlledInput/types.ts';
import { InputProps } from '../Input/Input.tsx';

export interface DecimalInputProps extends ControlledInputProps {
    min?: number,
    max?: number,
    digits?: number,
    allowNegative?: boolean,
    allowMultipleLeadingZeros?: boolean,
}

const defaultProps = {
    value: '',
    min: null,
    max: null,
    digits: undefined,
    allowNegative: true,
    allowMultipleLeadingZeros: false,
};

export const DecimalInput: React.FC<DecimalInputProps> = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const isValidValue = (value: string) => {
        if (value === '') {
            return true;
        }

        const fixed = fixFloat(value);
        if (fixed === null || !isNumberString(fixed)) {
            return false;
        }

        if (!props.allowMultipleLeadingZeros && isMultipleLeadingZeros(fixed)) {
            return false;
        }

        const float = parseFloat(fixed);
        if (!props.allowNegative && (float < 0 || fixed.startsWith('-'))) {
            return false;
        }

        const { min, max } = props;
        if (
            (typeof min === 'number' && float < min)
            || (typeof max === 'number' && float > max)
        ) {
            return false;
        }

        const { digits } = props;
        if (typeof digits === 'number') {
            const length = getDecimalPlaces(value);
            const allowedLength = getAllowedDecimalPlaces(digits);
            if (length > allowedLength) {
                return false;
            }
        }

        return true;
    };

    const renderValue = (state: InputProps): string => {
        const decState = state as DecimalInputProps;
        const res = (
            (decState.value && (typeof decState.digits === 'number'))
                ? trimDecimalPlaces(decState.value, decState.digits)
                : decState.value
        );
        return res ?? '';
    };

    const inputProps = {
        isValidValue,
        renderValue,
        onInput: props.onInput,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
        onChange: props.onChange,
        id: props.id,
        className: props.className,
        value: props.value,
        placeholder: props.placeholder,
        disabled: props.disabled,
    };

    return (
        <ControlledInput
            {...inputProps}
        />
    );
};

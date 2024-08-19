import {
    fixFloat,
    getAllowedDecimalPlaces,
    getDecimalPlaces,
    isMultipleLeadingZeros,
    isNumberString,
    trimDecimalPlaces,
} from '@jezvejs/number';

import { ControlledInput, ControlledInputProps } from '../ControlledInput/ControlledInput.tsx';

export interface DecimalInputProps extends ControlledInputProps {
    min: number,
    max: number,
    digits: number,
    allowNegative: boolean,
    allowMultipleLeadingZeros: boolean,
}

const defaultProps = {
    value: '',
    min: null,
    max: null,
    digits: undefined,
    allowNegative: true,
    allowMultipleLeadingZeros: false,
};

export const DecimalInput = (p: DecimalInputProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const isValidValue = (value: string) => {
        if (value === '') {
            return true;
        }

        const fixed = fixFloat(value);
        if (!isNumberString(fixed)) {
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

    const renderValue = (state: DecimalInputProps) => (
        (typeof state.digits === 'number')
            ? trimDecimalPlaces(state.value, state.digits)
            : state.value
    );

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
    };

    return (
        <ControlledInput
            {...inputProps}
        />
    );
};

import {
    fixFloat,
    getAllowedDecimalPlaces,
    getDecimalPlaces,
    isMultipleLeadingZeros,
    isNumberString,
    trimDecimalPlaces,
} from '@jezvejs/number';
import PropTypes from 'prop-types';

import { ControlledInput } from '../ControlledInput/ControlledInput.tsx';

const defaultProps = {
    value: '',
    min: null,
    max: null,
    digits: undefined,
    allowNegative: true,
    allowMultipleLeadingZeros: false,
};

export const DecimalInput = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const isValidValue = (value) => {
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

    const renderValue = (state) => (
        (typeof digits === 'number')
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

DecimalInput.propTypes = {
    ...ControlledInput.propTypes,
    min: PropTypes.number,
    max: PropTypes.number,
    digits: PropTypes.number,
    allowNegative: PropTypes.bool,
    allowMultipleLeadingZeros: PropTypes.bool,
};

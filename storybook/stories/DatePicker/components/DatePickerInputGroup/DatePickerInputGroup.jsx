import PropTypes from 'prop-types';
import { useState } from 'react';
import { DatePicker } from '@jezvejs/react';

import { formatDates } from '../../helpers.js';

import { DateInputGroup } from '../DateInputGroup/DateInputGroup.jsx';

export const DatePickerInputGroup = (props) => {
    const {
        inputId = null,
        ...rest
    } = props;

    const [state, setState] = useState({
        value: '',
        open: false,
    });

    const inputProps = {
        id: inputId,
        value: state.value,
        onButtonClick: () => {
            setState((prev) => ({ ...prev, open: !prev.open }));
        },
    };

    const datePickerProps = {
        ...rest,
        visible: state.open,
        onDateSelect: (dates) => {
            setState((prev) => ({
                ...prev,
                value: formatDates(dates),
            }));
        },
    };

    return (
        <DatePicker {...datePickerProps} >
            <DateInputGroup {...inputProps} />
        </DatePicker>
    );
};

DatePickerInputGroup.propTypes = {
    ...DatePicker.propTypes,
    inputId: PropTypes.string,
};

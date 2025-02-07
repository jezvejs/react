import { useState } from 'react';
import { DatePicker, DatePickerProps } from '@jezvejs/react';

import { formatDates } from '../../helpers.ts';

import { DateInputGroup } from '../DateInputGroup/DateInputGroup.tsx';

export type DatePickerInputGroupProps = DatePickerProps & {
    inputId?: string;
};

export const DatePickerInputGroup: React.FC<DatePickerInputGroupProps> = (props) => {
    const {
        inputId,
        ...rest
    } = props;

    const [state, setState] = useState({
        value: '',
        open: false,
    });

    const inputProps = {
        inputId,
        value: state.value,
        onButtonClick: () => {
            setState((prev) => ({ ...prev, open: !prev.open }));
        },
    };

    const datePickerProps = {
        ...rest,
        visible: state.open,
        onShow: () => {
            setState((prev) => ({
                ...prev,
                open: true,
            }));
        },
        onHide: () => {
            setState((prev) => ({
                ...prev,
                open: false,
            }));
        },
        onDateSelect: (dates: Date | Date[] | null) => {
            setState((prev) => ({
                ...prev,
                value: formatDates(dates ?? []),
            }));
        },
    };

    return (
        <DatePicker {...datePickerProps} >
            <DateInputGroup {...inputProps} />
        </DatePicker>
    );
};

// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useState } from 'react';
import { formatDate } from '@jezvejs/datetime';
import { DatePicker, Input } from '@jezvejs/react';

import { ActionButton } from '../../Components/ActionButton/ActionButton.jsx';

import { CustomDatePickerFooter } from './components/CustomFooter/CustomDatePickerFooter.jsx';
import { DatePickerInputGroup } from './components/DatePickerInputGroup/DatePickerInputGroup.jsx';
import { DateInputGroup } from './components/DateInputGroup/DateInputGroup.jsx';

import './DatePicker.stories.scss';
import { formatDateRange, formatDates } from './helpers.js';

export default {
    title: 'Components/DatePicker',
    component: DatePicker,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const heightDecorator = (Story) => (
    <div className="height-container">
        <Story />
    </div>
);

const widthDecorator = (Story) => (
    <div className="width-container">
        <Story />
    </div>
);

export const Default = {
    args: {
        inline: true,
        animated: true,
    },
    decorators: [heightDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            value: '',
        });

        const inputProps = {
            id: 'inlineDateInp',
            value: state.value,
        };

        const props = {
            ...args,
            onDateSelect: (date) => {
                setState((prev) => ({
                    ...prev,
                    value: formatDate(date),
                }));
            },
        };

        return (
            <div>
                <Input {...inputProps} />
                <DatePicker {...props} />
            </div>
        );
    },
};

/**
 * Month view will always render 6 weeks.
 */
export const FixedHeight = {
    args: {
        inline: true,
        animated: true,
        fixedHeight: true,
    },
    decorators: [heightDecorator],
};

/**
 * Fill parent width
 */
export const FullWidth = {
    args: {
        inline: true,
        className: 'dp_full-width',
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [widthDecorator, heightDecorator],
};

export const Popup = {
    args: {
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    render: (args) => (
        <DatePickerInputGroup {...args} />
    ),
};

export const PopupPosition = {
    args: {
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [heightDecorator],
    render: function Render(args) {
        const [state, setState] = useState({
            open: false,
        });

        const props = {
            ...args,
            visible: state.open,
            onDateSelect: (date) => {
                setState((prev) => ({ ...prev, value: formatDate(date) }));
            },
        };

        const toggleShow = () => {
            setState((prev) => ({ ...prev, open: !prev.open }));
        };

        return (
            <div className="right-container">
                <DatePicker {...props} >
                    <ActionButton onClick={toggleShow}>Show</ActionButton>
                </DatePicker>
            </div>
        );
    },
};

export const HideOnSelect = {
    args: {
        hideOnSelect: true,
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    render: (args) => (
        <DatePickerInputGroup {...args} />
    ),
};

export const CustomFooter = {
    args: {
        multiple: true,
        position: {
            margin: 5,
            screenPadding: 5,
        },
        components: {
            Footer: CustomDatePickerFooter,
        },
    },
    decorators: [heightDecorator],
    render: function Render(args) {
        const {
            inputId = null,
            ...rest
        } = args;

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
            footer: {
                title: 'Custom footer',
                onSubmit: () => {
                    setState((prev) => ({ ...prev, open: false }));
                },
            },
            onDateSelect: (date) => {
                setState((prev) => ({ ...prev, value: formatDates(date) }));
            },
        };

        return (
            <DatePicker {...datePickerProps} >
                <DateInputGroup {...inputProps} />
            </DatePicker>
        );
    },
};

/**
 * Select multiple dates
 */
export const Multiple = {
    args: {
        multiple: true,
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    render: (args) => (
        <DatePickerInputGroup {...args} />
    ),
};

export const RangeSelect = {
    args: {
        range: true,
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    render: function Render(args) {
        const {
            inputId = null,
            ...rest
        } = args;

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
            onRangeSelect: (range) => {
                setState((prev) => ({ ...prev, value: formatDateRange(range) }));
            },
        };

        return (
            <DatePicker {...datePickerProps} >
                <DateInputGroup {...inputProps} />
            </DatePicker>
        );
    },
};

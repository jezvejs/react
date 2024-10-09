// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useState } from 'react';
import { formatDate } from '@jezvejs/datetime';
import { DatePicker, Input } from '@jezvejs/react';

import { ActionButton } from '../../common/Components/ActionButton/ActionButton.jsx';
import { SectionControls } from '../../common/Components/SectionControls/SectionControls.jsx';

import { CustomDatePickerFooter } from './components/CustomFooter/CustomDatePickerFooter.jsx';
import { DateInputGroup } from './components/DateInputGroup/DateInputGroup.jsx';
import { DatePickerInputGroup } from './components/DatePickerInputGroup/DatePickerInputGroup.jsx';
import { DateRangeInputGroup } from './components/DateRangeInputGroup/DateRangeInputGroup.jsx';

import { disabledOutsideRange, formatDateRange, formatDates } from './helpers.js';
import './DatePicker.stories.scss';

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
    parameters: {
        layout: 'fullscreen',
    },
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
};

/**
 * Fill parent width
 */
export const FullWidth = {
    args: {
        inline: true,
        className: 'dp_full-width',
    },
    decorators: [widthDecorator],
    parameters: {
        layout: 'fullscreen',
    },
};

export const Popup = {
    args: {
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
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
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
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
    parameters: {
        layout: 'fullscreen',
    },
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
    parameters: {
        layout: 'fullscreen',
    },
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
    parameters: {
        layout: 'fullscreen',
    },
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
    parameters: {
        layout: 'fullscreen',
    },
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

/**
 * Shows two views if screen width at least 724px.
 */
export const DoubleView = {
    args: {
        range: true,
        doubleView: true,
        animated: true,
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: (args) => (
        <DatePickerInputGroup {...args} />
    ),
};

/**
 * + disabled 'showOtherMonthDays' option
 */
export const Vertical = {
    args: {
        vertical: true,
        animated: true,
        showOtherMonthDays: false,
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: (args) => (
        <DatePickerInputGroup {...args} />
    ),
};

export const VerticalDoubleView = {
    args: {
        vertical: true,
        doubleView: true,
        animated: true,
        showOtherMonthDays: false,
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: (args) => (
        <DatePickerInputGroup {...args} />
    ),
};

export const Callbacks = {
    args: {
        range: true,
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: function Render(args) {
        const {
            inputId = null,
            ...rest
        } = args;

        const [state, setState] = useState({
            value: '',
            open: false,
            statusText: 'Waiting',
        });

        const setStatus = (statusText) => setState((prev) => ({ ...prev, statusText }));

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
            onDateSelect: (date) => {
                setStatus(`Date selected: ${formatDate(date)}`);
            },
            onRangeSelect: (range) => {
                setState((prev) => ({ ...prev, value: formatDateRange(range) }));
            },
            onShow: () => {
                setStatus('Select range...');
            },
            onHide: () => {
                setStatus('Loading...');
            },
        };

        return (
            <div>
                <div>{state.statusText}</div>
                <DatePicker {...datePickerProps} >
                    <DateInputGroup {...inputProps} />
                </DatePicker>
            </div>
        );
    },
};

export const SetSelection = {
    args: {
        range: true,
        startDate: new Date(Date.UTC(2020, 11, 1)),
        endDate: new Date(Date.UTC(2020, 11, 7)),
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: function Render(args) {
        const {
            inputId = null,
            ...rest
        } = args;

        const [state, setState] = useState({
            open: false,
            startDate: rest.startDate,
            endDate: rest.endDate,
            value: formatDateRange({
                start: rest.startDate,
                end: rest.endDate,
            }),
        });

        const getRangeToSelect = () => ({
            start: new Date(Date.UTC(2020, 11, 8)),
            end: new Date(Date.UTC(2020, 11, 14)),
        });

        const onSelect = () => {
            const rangeToSelect = getRangeToSelect();
            setState((prev) => ({
                ...prev,
                startDate: rangeToSelect.start,
                endDate: rangeToSelect.end,
                value: formatDateRange(rangeToSelect),
            }));
        };

        const onClear = () => {
            setState((prev) => ({
                ...prev,
                startDate: null,
                endDate: null,
                value: '',
            }));
        };

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
            startDate: state.startDate,
            endDate: state.endDate,
            onRangeSelect: (range) => {
                setState((prev) => ({ ...prev, value: formatDateRange(range) }));
            },
        };

        return (
            <div>
                <DatePicker {...datePickerProps} >
                    <DateInputGroup {...inputProps} />
                </DatePicker>
                <SectionControls>
                    <ActionButton
                        id="setSelectionBtn"
                        title="Select"
                        onClick={onSelect}
                    />
                    <ActionButton
                        id="clearSelectionBtn"
                        title="Clear"
                        onClick={onClear}
                    />
                </SectionControls>
            </div>
        );
    },
};

export const DisabledDateFilter = {
    args: {
        range: true,
        startDate: new Date(Date.UTC(2010, 1, 10)),
        disabledDateFilter: disabledOutsideRange,
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: function Render(args) {
        const {
            inputId = null,
            ...rest
        } = args;

        const [state, setState] = useState({
            value: '',
            open: false,
            startDate: rest.startDate,
            endDate: rest.endDate,
            disabledDateFilter: rest.disabledDateFilter,
        });

        const onSetDisabled = () => {
            setState((prev) => ({
                ...prev,
                disabledDateFilter: disabledOutsideRange,
            }));
        };

        const onClearDisabled = () => {
            setState((prev) => ({
                ...prev,
                disabledDateFilter: null,
            }));
        };

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
            startDate: state.startDate,
            endDate: state.endDate,
            disabledDateFilter: state.disabledDateFilter,
            onRangeSelect: (range) => {
                setState((prev) => ({ ...prev, value: formatDateRange(range) }));
            },
        };

        return (
            <div>
                <DatePicker {...datePickerProps} >
                    <DateInputGroup {...inputProps} />
                </DatePicker>
                <SectionControls>
                    <ActionButton
                        id="setSelectionBtn"
                        title="Set disabled days"
                        onClick={onSetDisabled}
                    />
                    <ActionButton
                        id="clearSelectionBtn"
                        title="Clear disabled days"
                        onClick={onClearDisabled}
                    />
                </SectionControls>
            </div>
        );
    },
};

export const RangePart = {
    args: {
        startDate: new Date(Date.UTC(2010, 1, 10)),
        position: {
            margin: 5,
            screenPadding: 5,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: function Render(args) {
        const [state, setState] = useState({
            value: '',
            open: false,
            startDate: args.startDate,
            endDate: args.endDate,
            rangePart: 'start',
        });

        const show = (open = true) => {
            setState((prev) => ({ ...prev, open }));
        };

        const hide = () => show(false);

        const setRangePart = (rangePart) => {
            setState((prev) => ({ ...prev, rangePart }));
        };

        const inputProps = {
            id: 'dpRangePartGroup',
            startInputId: 'startDateInp',
            endInputId: 'endDateInp',
            startButtonId: 'selectStartDateBtn',
            endButtonId: 'selectEndDateBtn',
            startDate: formatDates(state.startDate),
            endDate: formatDates(state.endDate),
            onStartButtonClick: () => {
                setRangePart('start');
                show();
            },
            onEndButtonClick: () => {
                setRangePart('end');
                show();
            },
        };

        const datePickerProps = {
            ...args,
            visible: state.open,
            startDate: state.startDate,
            endDate: state.endDate,
            rangePart: state.rangePart,
            disabledDateFilter: (date) => {
                const rangePart = state?.rangePart;
                if (rangePart !== 'start' && rangePart !== 'end') {
                    return false;
                }

                const limitDate = (rangePart === 'start')
                    ? state.endDate
                    : state.startDate;
                if (!limitDate) {
                    return false;
                }

                return (rangePart === 'start') ? (limitDate - date < 0) : (limitDate - date > 0);
            },
            onDateSelect: (date) => {
                setState((prev) => ({
                    ...prev,
                    startDate: (prev.rangePart === 'start') ? date : prev.startDate,
                    endDate: (prev.rangePart === 'end') ? date : prev.endDate,
                }));

                hide();
            },
        };

        return (
            <div>
                <DatePicker {...datePickerProps} >
                    <DateRangeInputGroup {...inputProps} />
                </DatePicker>
            </div>
        );
    },
};

export const FirstDayMonday = {
    args: {
        inline: true,
        locales: ['en-US'],
        firstDay: 1,
    },
};

export const FirstDaySunday = {
    args: {
        inline: true,
        locales: ['en-US'],
        firstDay: 7,
    },
};

/**
 * en-US locale
 */
export const EnLocale = {
    args: {
        inline: true,
        locales: ['en-US'],
    },
};

/**
 * fr locale
 */
export const FrLocale = {
    args: {
        inline: true,
        locales: ['fr'],
    },
};

/**
 * ru locale
 */
export const RuLocale = {
    args: {
        inline: true,
        locales: ['ru'],
    },
};

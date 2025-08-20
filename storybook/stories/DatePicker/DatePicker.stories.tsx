import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { useState } from 'react';
import { formatDate } from '@jezvejs/datetime';
import {
    DatePicker,
    DatePickerProps,
    DatePickerRange,
    DatePickerRangePart,
    Input,
} from '@jezvejs/react';

import { ActionButton } from 'common/Components/ActionButton/ActionButton.tsx';
import { LocaleSelect } from 'common/Components/LocaleSelect/LocaleSelect.tsx';
import { SectionControls } from 'common/Components/SectionControls/SectionControls.tsx';

import { CustomDatePickerFooter } from './components/CustomFooter/CustomDatePickerFooter.tsx';
import { DateInputGroup } from './components/DateInputGroup/DateInputGroup.tsx';
import { DatePickerInputGroup } from './components/DatePickerInputGroup/DatePickerInputGroup.tsx';
import { DateRangeInputGroup } from './components/DateRangeInputGroup/DateRangeInputGroup.tsx';

import { disabledOutsideRange, formatDateRange, formatDates } from './helpers.ts';
import './DatePicker.stories.scss';

type Story = StoryObj<typeof DatePicker>;

const meta: Meta<typeof DatePicker> = {
    title: 'Components/DatePicker',
    component: DatePicker,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

const heightDecorator = (StoryComponent: StoryFn) => (
    <div className="height-container">
        <StoryComponent />
    </div>
);

const widthDecorator = (StoryComponent: StoryFn) => (
    <div className="width-container">
        <StoryComponent />
    </div>
);

export const Default: Story = {
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
            onDateSelect: (date: Date | null) => {
                setState((prev) => ({
                    ...prev,
                    value: (date) ? formatDate(date) : '',
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
export const FixedHeight: Story = {
    args: {
        inline: true,
        animated: true,
        fixedHeight: true,
    },
};

/**
 * Fill parent width
 */
export const FullWidth: Story = {
    args: {
        inline: true,
        className: 'dp_full-width',
    },
    decorators: [widthDecorator],
    parameters: {
        layout: 'fullscreen',
    },
};

export const Popup: Story = {
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

export const PopupPosition: Story = {
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
            onDateSelect: (date: Date | null) => {
                setState((prev) => ({
                    ...prev,
                    value: (date) ? formatDate(date) : '',
                }));
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

export const HideOnSelect: Story = {
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

type DatePickerWithInputProps = DatePickerProps & {
    inputId?: string;
};

type DatePickerWithInputComponent = React.FC<DatePickerWithInputProps>;

type WithInputStory = StoryObj<DatePickerWithInputComponent>;

export const CustomFooter: WithInputStory = {
    args: {
        multiple: true,
        position: {
            margin: 5,
            screenPadding: 5,
        },
        components: {
            Footer: CustomDatePickerFooter as React.ComponentType,
        },
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: function Render(args) {
        const {
            inputId,
            ...rest
        } = args;

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
            footer: {
                title: 'Custom footer',
                onSubmit: () => {
                    setState((prev) => ({ ...prev, open: false }));
                },
            },
            onDateSelect: (date: Date | null) => {
                setState((prev) => ({
                    ...prev,
                    value: formatDates(date ?? []),
                }));
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
export const Multiple: Story = {
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

export const RangeSelect: WithInputStory = {
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
            inputId,
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
            onRangeSelect: (range: DatePickerRange) => {
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
export const DoubleView: Story = {
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
export const Vertical: Story = {
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

export const VerticalDoubleView: Story = {
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

export const Callbacks: WithInputStory = {
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
            inputId,
            ...rest
        } = args;

        const [state, setState] = useState({
            value: '',
            open: false,
            statusText: 'Waiting',
        });

        const setStatus = (statusText: string) => setState((prev) => ({ ...prev, statusText }));

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
            onDateSelect: (date: Date | null) => {
                setStatus(`Date selected: ${(date) ? formatDate(date) : ''}`);
            },
            onRangeSelect: (range: DatePickerRange) => {
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

export const SetSelection: WithInputStory = {
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
            inputId,
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
            onRangeSelect: (range: DatePickerRange) => {
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

export const DisabledDateFilter: WithInputStory = {
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
            inputId,
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
            onRangeSelect: (range: DatePickerRange) => {
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

export const RangePart: Story = {
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
            rangePart: 'start' as DatePickerRangePart,
        });

        const show = (open = true) => {
            setState((prev) => ({ ...prev, open }));
        };

        const hide = () => show(false);

        const setRangePart = (rangePart: DatePickerRangePart) => {
            setState((prev) => ({ ...prev, rangePart }));
        };

        const inputProps = {
            id: 'dpRangePartGroup',
            startInputId: 'startDateInp',
            endInputId: 'endDateInp',
            startButtonId: 'selectStartDateBtn',
            endButtonId: 'selectEndDateBtn',
            startDate: formatDates(state.startDate ?? []),
            endDate: formatDates(state.endDate ?? []),
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
            disabledDateFilter: (date: Date) => {
                const rangePart = state?.rangePart;
                if (rangePart !== 'start' && rangePart !== 'end') {
                    return false;
                }

                const limitDate = (rangePart === 'start') ? state.endDate : state.startDate;
                const limitTime = limitDate?.getTime() ?? 0;
                if (!limitTime) {
                    return false;
                }
                const time = date.getTime();

                return (rangePart === 'start') ? (limitTime - time < 0) : (limitTime - time > 0);
            },
            onDateSelect: (date: Date | null) => {
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

export const FirstDayMonday: Story = {
    args: {
        inline: true,
        locales: ['en-US'],
        firstDay: 1,
    },
};

export const FirstDaySunday: Story = {
    args: {
        inline: true,
        locales: ['en-US'],
        firstDay: 7,
    },
};

/**
 * 'locales' property
 */
export const Locales: Story = {
    args: {
        inline: true,
        locales: ['en-US'],
    },
    decorators: [heightDecorator],
    parameters: {
        layout: 'fullscreen',
    },
    render: function Render(args) {
        const [state, setState] = useState({
            value: '',
            open: false,
            locales: args.locales,
        });

        const inputProps = {
            id: 'localesDateInp',
            value: state.value,
        };

        const props = {
            ...args,
            onDateSelect: (date: Date | null) => {
                setState((prev) => ({
                    ...prev,
                    value: (date) ? formatDate(date) : '',
                }));
            },
        };

        const onChangeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setState((prev) => ({
                ...prev,
                locales: [e.target.value],
            }));
        };

        return (
            <div>
                <div>
                    <Input {...inputProps} />
                    <DatePicker {...props} locales={state.locales} />
                </div>
                <SectionControls>
                    <LocaleSelect id="localeSelect" onChange={onChangeLocale} />
                </SectionControls>
            </div>
        );
    },
};

/**
 * en-US locale
 */
export const EnLocale: Story = {
    args: {
        inline: true,
        locales: ['en-US'],
    },
};

/**
 * fr locale
 */
export const FrLocale: Story = {
    args: {
        inline: true,
        locales: ['fr'],
    },
};

/**
 * ru locale
 */
export const RuLocale: Story = {
    args: {
        inline: true,
        locales: ['ru'],
    },
};

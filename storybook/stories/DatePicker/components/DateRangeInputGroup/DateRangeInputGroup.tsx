import classNames from 'classnames';
import {
    InputGroup,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
} from '@jezvejs/react';

import CalendarIcon from '../../../../common/assets/icons/calendar.svg';

import './DateRangeInputGroup.scss';

export type DateRangeInputGroupProps = {
    className?: string;

    startInputId?: string;
    startButtonId?: string;
    startDate: string;
    onStartInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStartButtonClick?: (e: React.MouseEvent) => void;

    endInputId?: string;
    endButtonId?: string;
    endDate: string;
    onEndInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEndButtonClick?: (e: React.MouseEvent) => void;
};

export const DateRangeInputGroup: React.FC<DateRangeInputGroupProps> = (props) => (
    <InputGroup
        className={classNames('date-range-input-group', props.className)}
    >
        <InputGroupInput
            id={props.startInputId}
            value={props.startDate}
            onInput={props.onStartInput}
        />
        <InputGroupButton
            id={props.startButtonId}
            icon={CalendarIcon}
            onClick={props.onStartButtonClick}
        />
        <InputGroupText title="-" />
        <InputGroupInput
            id={props.endInputId}
            value={props.endDate}
            onInput={props.onEndInput}
        />
        <InputGroupButton
            id={props.endButtonId}
            icon={CalendarIcon}
            onClick={props.onEndButtonClick}
        />
    </InputGroup>
);

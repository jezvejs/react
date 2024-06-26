import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    InputGroup,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
} from '@jezvejs/react';

import CalendarIcon from '../../../../assets/icons/calendar.svg';

export const DateRangeInputGroup = (props) => (
    <InputGroup
        className={classNames('date-input-group', props.className)}
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

DateRangeInputGroup.propTypes = {
    ...InputGroup.propTypes,
    startInputId: PropTypes.string,
    startButtonId: PropTypes.string,
    startDate: PropTypes.string,
    onStartInput: PropTypes.func,
    onStartButtonClick: PropTypes.func,

    endInputId: PropTypes.string,
    endButtonId: PropTypes.string,
    endDate: PropTypes.string,
    onEndInput: PropTypes.func,
    onEndButtonClick: PropTypes.func,
};

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InputGroup, InputGroupButton, InputGroupInput } from '@jezvejs/react';

import CalendarIcon from '../../../../assets/icons/calendar.svg';

import './DateInputGroup.scss';

export const DateInputGroup = (props) => (
    <InputGroup
        className={classNames('date-input-group', props.className)}
    >
        <InputGroupInput
            id={props.inputId}
            placeholder={props.placeholder}
            value={props.value}
            onInput={props.onInput}
        />
        <InputGroupButton
            id={props.buttonId}
            icon={CalendarIcon}
            onClick={props.onButtonClick}
        />
    </InputGroup>
);

DateInputGroup.propTypes = {
    ...InputGroup.propTypes,
    inputId: PropTypes.string,
    buttonId: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onInput: PropTypes.func,
    onButtonClick: PropTypes.func,
};

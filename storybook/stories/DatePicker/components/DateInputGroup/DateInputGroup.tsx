import classNames from 'classnames';
import { InputGroup, InputGroupButton, InputGroupInput } from '@jezvejs/react';

import CalendarIcon from 'common/assets/icons/calendar.svg';

import './DateInputGroup.scss';

export type DateInputGroupProps = {
    className?: string;
    inputId?: string;
    buttonId?: string;
    placeholder?: string;
    value: string;
    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onButtonClick?: (e: React.MouseEvent) => void,
};

export const DateInputGroup: React.FC<DateInputGroupProps> = (props) => (
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

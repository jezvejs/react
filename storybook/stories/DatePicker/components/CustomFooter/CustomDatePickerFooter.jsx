import PropTypes from 'prop-types';
import { InputGroup } from '@jezvejs/react';
import { ActionButton } from '../../../../common/Components/ActionButton/ActionButton.jsx';
import './CustomDatePickerFooter.scss';

export const CustomDatePickerFooter = (props) => (
    <div className="custom-footer">
        <div className="custom-footer__title">{props.title}</div>
        <ActionButton onClick={props.onSubmit}>Ok</ActionButton>
    </div>
);

CustomDatePickerFooter.propTypes = {
    ...InputGroup.propTypes,
    title: PropTypes.string,
    onSubmit: PropTypes.func,
};

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Button } from '../../../../Button/Button.jsx';

import ToggleIcon from './assets/toggle.svg';
import './ToggleButton.scss';

export const DropDownToggleButton = (props) => (
    <Button
        {...props}
        icon={ToggleIcon}
        className={classNames('dd__toggle-btn', props.className)}
        type="static"
    />
);

DropDownToggleButton.propTypes = {
    className: PropTypes.string,
};

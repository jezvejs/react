import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Button } from '../Button/Button.jsx';

import CloseIcon from './assets/close.svg';
import SmallCloseIcon from './assets/close-sm.svg';

import './CloseButton.scss';

/**
 * CloseButton component
 */
export const CloseButton = ({ small, ...props }) => (
    <Button
        {...props}
        className={classNames('close-btn', props.className)}
        icon={(props.small) ? SmallCloseIcon : CloseIcon}
    />
);

CloseButton.propTypes = {
    ...Button.propTypes,
    small: PropTypes.bool,
};

CloseButton.defaultProps = {
    ...Button.defaultProps,
    small: true,
};

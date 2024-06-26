import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MenuGroupHeader } from '../../../../Menu/Menu.jsx';
import './GroupHeader.scss';

/**
 * Menu group header component
 */
export const DropDownGroupHeader = (props) => (
    <MenuGroupHeader
        {...props}
        className={classNames('dd__list-group__label', props.className)}
    />
);

DropDownGroupHeader.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
};

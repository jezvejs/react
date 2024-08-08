import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MenuGroupItem } from '../../../../Menu/Menu.tsx';
import './GroupItem.scss';

export const DropDownGroupItem = (props) => (
    <MenuGroupItem
        {...props}
        className={classNames('dd__list-group', props.className)}
    />
);

DropDownGroupItem.propTypes = {
    className: PropTypes.string,
};

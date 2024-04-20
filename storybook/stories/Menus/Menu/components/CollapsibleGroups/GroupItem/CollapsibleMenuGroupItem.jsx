import { MenuGroupItem } from '@jezvejs/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './CollapsibleMenuGroupItem.scss';

export const CollapsibleMenuGroupItem = (props) => (
    <MenuGroupItem
        {...props}
        className={classNames(
            'menu-group_collapsible',
            { expanded: !!props.expanded },
            props.className,
        )}
    />
);

CollapsibleMenuGroupItem.propTypes = {
    ...MenuGroupItem.propTypes,
    expanded: PropTypes.bool,
};

CollapsibleMenuGroupItem.defaultProps = {
    ...MenuGroupItem.defaultProps,
    expanded: false,
};

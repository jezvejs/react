import { MenuGroupItem } from '@jezvejs/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { DropDownCollapsibleMenuGroupHeader } from '../GroupHeader/CollapsibleMenuGroupHeader.jsx';
import './CollapsibleMenuGroupItem.scss';

export const DropDownCollapsibleMenuGroupItem = (props) => (
    <MenuGroupItem
        {...props}
        className={classNames(
            'menu-group_collapsible',
            { expanded: props.expanded },
        )}
        allowActiveGroupHeader
    />
);

DropDownCollapsibleMenuGroupItem.propTypes = {
    ...MenuGroupItem.propTypes,
    expanded: PropTypes.bool,
};

DropDownCollapsibleMenuGroupItem.defaultProps = {
    ...MenuGroupItem.defaultProps,
    expanded: true,
    components: {
        ...MenuGroupItem.defaultProps.components,
        GroupHeader: DropDownCollapsibleMenuGroupHeader,
    },
};

import { MenuGroupItem } from '@jezvejs/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { DropDownCollapsibleMenuGroupHeader } from '../GroupHeader/CollapsibleMenuGroupHeader.jsx';
import './CollapsibleMenuGroupItem.scss';

const defaultProps = {
    expanded: true,
    components: {
        GroupHeader: DropDownCollapsibleMenuGroupHeader,
    },
};

export const DropDownCollapsibleMenuGroupItem = (p) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    return (
        <MenuGroupItem
            {...props}
            className={classNames(
                'menu-group_collapsible',
                { expanded: props.expanded },
            )}
            allowActiveGroupHeader
        />
    );
};

DropDownCollapsibleMenuGroupItem.propTypes = {
    ...MenuGroupItem.propTypes,
    expanded: PropTypes.bool,
};

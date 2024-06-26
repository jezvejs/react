import { MenuGroupItem } from '@jezvejs/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './CollapsibleMenuGroupItem.scss';

const defaultProps = {
    expanded: false,
};

export const CollapsibleMenuGroupItem = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <MenuGroupItem
            {...props}
            className={classNames(
                'menu-group_collapsible',
                { expanded: !!props.expanded },
                props.className,
            )}
        />
    );
};

CollapsibleMenuGroupItem.propTypes = {
    ...MenuGroupItem.propTypes,
    expanded: PropTypes.bool,
};

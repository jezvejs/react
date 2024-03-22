import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MenuGroupItem.scss';

export const MenuGroupItem = (props) => {
    const { GroupHeader, List } = props.components;
    if (!GroupHeader) {
        throw new Error('Invalid group header component');
    }
    if (!List) {
        throw new Error('Invalid menu list component');
    }

    const {
        id,
        className,
        ...listProps
    } = props;

    const commonProps = {
        className: classNames('menu-item menu-group', className),
        'data-id': id,
    };

    return (
        <div {...commonProps}>
            <GroupHeader {...props} />
            <List {...listProps} />
        </div>
    );
};

MenuGroupItem.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    beforeContent: PropTypes.bool,
    afterContent: PropTypes.bool,
    onItemClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string,
        icon: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.elementType,
        ]),
    })),
    components: PropTypes.shape({
        List: PropTypes.func,
        ListItem: PropTypes.func,
        GroupHeader: PropTypes.func,
    }),
};

MenuGroupItem.defaultProps = {
    items: [],
    components: {
        List: null,
        ListItem: null,
        GroupHeader: null,
    },
};

MenuGroupItem.selector = '.menu-item.menu-group';

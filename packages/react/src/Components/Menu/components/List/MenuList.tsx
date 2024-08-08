import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getClosestItemElement } from '../../helpers.ts';
import './MenuList.scss';

const defaultProps = {
    items: [],
};

/**
 * MenuList component
 */
export const MenuList = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        ListItem,
        Separator,
        GroupItem,
        ListPlaceholder,
    } = props.components;

    const handleClick = (e) => {
        e?.stopPropagation();

        const elem = e?.target;
        const closestElem = getClosestItemElement(elem, props);
        const itemId = closestElem?.dataset?.id ?? null;
        if (itemId === null) {
            return;
        }

        props.onItemClick?.(itemId, e);
    };

    const handleMouseEnter = (e) => {
        const elem = e?.target;
        const closestElem = getClosestItemElement(elem, props);
        const itemId = closestElem?.dataset?.id ?? null;

        props.onMouseEnter?.(itemId, e);
    };

    const handleMouseLeave = (e) => {
        const elem = e?.relatedTarget;

        const closestElem = getClosestItemElement(elem, props);
        const itemId = closestElem?.dataset?.id ?? null;

        props.onMouseLeave?.(itemId, e);
    };

    const itemElement = (item) => {
        if (item.type === 'separator') {
            return <Separator key={item.id} {...item} />;
        }
        if (item.type === 'group') {
            return <GroupItem key={item.id} {...item} />;
        }
        return <ListItem key={item.id} {...item} />;
    };

    const itemProps = (item, state) => (
        state.getItemProps(item, state)
    );

    return (
        <div
            className={classNames(
                'menu-list',
                {
                    'menu-list_left': props.beforeContent,
                    'menu-list_right': props.afterContent,
                },
                props.className,
            )}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
        >
            {(props.items.length > 0)
                ? props.items.map((item) => (
                    itemElement(itemProps(item, props))
                ))
                : (ListPlaceholder && <ListPlaceholder {...props} />)
            }
        </div>
    );
};

MenuList.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    itemSelector: PropTypes.string,
    defaultItemType: PropTypes.string,
    renderNotSelected: PropTypes.bool,
    tabThrough: PropTypes.bool,
    iconAlign: PropTypes.oneOf(['left', 'right']),
    checkboxSide: PropTypes.oneOf(['left', 'right']),
    beforeContent: PropTypes.bool,
    afterContent: PropTypes.bool,
    onItemClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    getItemProps: PropTypes.func,
    activeItem: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf([null]),
    ]),
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
    })),
    components: PropTypes.shape({
        List: PropTypes.func,
        ListItem: PropTypes.func,
        ListPlaceholder: PropTypes.func,
        Check: PropTypes.func,
        Separator: PropTypes.func,
        GroupHeader: PropTypes.func,
        GroupItem: PropTypes.func,
    }),
};

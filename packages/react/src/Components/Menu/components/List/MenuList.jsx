import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MenuList.scss';

/**
 * MenuList component
 */
export const MenuList = (props) => {
    const { ListItem, Separator } = props.components;

    const handleClick = (e) => {
        e?.stopPropagation();

        const elem = e?.target;
        const closestElem = elem?.closest(props.itemSelector) ?? null;
        const itemId = closestElem?.dataset?.id ?? null;
        if (itemId === null) {
            return;
        }

        props.onItemClick(itemId, e);
    };

    const itemElement = (item) => (
        (item.type === 'separator')
            ? <Separator {...item} />
            : <ListItem {...item} />
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
        >
            {props.items.map((item) => (
                itemElement({
                    ...ListItem.defaultProps,
                    ...item,
                    iconAlign: item.iconAlign || props.iconAlign,
                    checkboxSide: item.checkboxSide || props.checkboxSide,
                    key: item.id,
                    components: props.components,
                })
            ))}
        </div>
    );
};

MenuList.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    itemSelector: PropTypes.string,
    iconAlign: PropTypes.oneOf(['left', 'right']),
    checkboxSide: PropTypes.oneOf(['left', 'right']),
    beforeContent: PropTypes.bool,
    afterContent: PropTypes.bool,
    onItemClick: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
    })),
    components: PropTypes.shape({
        List: PropTypes.func,
        ListItem: PropTypes.func,
        Check: PropTypes.func,
        Separator: PropTypes.func,
    }),
};

MenuList.defaultProps = {
    items: [],
    components: {
        ListItem: null,
    },
};

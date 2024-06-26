import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Tag } from '../Tag/Tag.jsx';

import { removeItemsById } from './helpers.js';
import './Tags.scss';

export const TagsHelpers = {
    removeItemsById,
};

const defaultProps = {
    ItemComponent: Tag,
    activeItemId: null,
    closeable: false,
    disabled: false,
    sortModeClass: 'tags_sort',
    onItemClick: null,
    onCloseItem: null,
};

/**
 * Tags list components
 */
export const Tags = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        disabled,
        ItemComponent,
    } = props;

    const getClosestItemElement = (elem) => (
        elem?.closest?.(props?.itemSelector ?? ItemComponent?.selector) ?? null
    );

    const getItemProps = (item, state) => ({
        ...item,
        disabled: item.disabled || state.disabled,
        listMode: state.listMode,
        active: item.id === state.activeItemId,
        closeable: (
            ('closeable' in item && item.closeable)
            || (!('closeable' in item) && state.closeable)
        ),
    });

    /**
     * Item click event handler
     * @param {Event} e - click event object
     */
    const onItemClick = (e) => {
        e?.stopPropagation();

        const elem = e?.target;
        const closestElem = getClosestItemElement(elem);
        const itemId = closestElem?.dataset?.id ?? null;
        if (itemId === null) {
            return;
        }

        if (props.closeable && ItemComponent.buttonClass) {
            if (e.target.closest(`.${ItemComponent.buttonClass}`)) {
                e.stopPropagation();

                props.onCloseItem?.(itemId, e);

                return;
            }
        }

        props.onItemClick?.(itemId, e);
    };

    return (
        <div
            className={classNames(
                'tags',
                props.className,
            )}
            onClick={onItemClick}
            disabled={disabled}
        >
            {props.items.map((item) => (
                <ItemComponent
                    {...getItemProps(item, props)}
                    key={`tag_${item.id}`}
                />
            ))}
        </div>
    );
};

Tags.propTypes = {
    ItemComponent: PropTypes.func,
    activeItemId: PropTypes.string,
    closeable: PropTypes.bool,
    disabled: PropTypes.bool,
    itemSelector: PropTypes.string,
    sortModeClass: PropTypes.string,
    onItemClick: PropTypes.func,
    onCloseItem: PropTypes.func,
    items: PropTypes.array,
    className: PropTypes.string,
};

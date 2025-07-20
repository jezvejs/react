import { MenuHelpers } from '../Menu/MenuContainer.tsx';
import { MenuProps, MenuState } from '../Menu/types.ts';
import { PopupMenuParentItemProps, PopupMenuProps, PopupMenuState } from './types.ts';

/**
 * Reducer function. Closes or opens menu by specified id
 * @param {T} state
 * @param {string} itemId
 * @param {boolean} open
 * @returns {T}
 */
export function setItemMenuOpen<T extends MenuProps = MenuState>(
    state: T,
    itemId: string,
    open: boolean,
): T {
    return {
        ...state,
        items: MenuHelpers.mapItems(
            state.items ?? [],
            (item) => {
                if (item.id?.toString() !== itemId) {
                    return { ...item, open: false };
                }

                if (item.disabled || item.type !== 'parent') {
                    return { ...item, open: false };
                }

                const parentItem = item as PopupMenuParentItemProps;
                return {
                    ...parentItem,
                    open,
                };
            },
            { includeGroupItems: state.allowActiveGroupHeader },
        ),
    };
}

/**
 * Reducer function. Opens menu by specified id
 * @param {T} state
 * @param {string} itemId
 * @returns {T}
 */
export function openItemMenu<T extends MenuProps = MenuState>(
    state: T,
    itemId: string,
): T {
    return setItemMenuOpen(state, itemId, true);
}

/**
 * Reducer function. Closes menu by specified id
 * @param {T} state
 * @param {string} itemId
 * @returns {T}
 */
export function closeItemMenu<T extends MenuProps = MenuState>(
    state: T,
    itemId: string,
): T {
    return setItemMenuOpen(state, itemId, false);
}

/**
 * Returns initial state object for specified props
 *
 * @param {PopupMenuProps} props
 * @param {PopupMenuProps} defProps
 * @returns {PopupMenuState}
 */
export const getInitialState = (
    props: Partial<PopupMenuProps>,
    defProps: PopupMenuProps,
): PopupMenuState => {
    const res: PopupMenuState = {
        ...(defProps ?? {}),
        ...MenuHelpers.getInitialState(props, defProps),
        open: false,
        listenScroll: false,
        ignoreTouch: false,
        components: {
            ...(defProps?.components ?? {}),
            ...props.components,
        },
    };

    return res;
};

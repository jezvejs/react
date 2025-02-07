import { asArray } from '@jezvejs/types';
import { TagsProps } from './Tags.tsx';

/**
 * Removes item by id
 * @param {string} itemId id or array of ids of items to remove
 */
export const removeItemsById = (state: TagsProps, itemId: string | string[]) => {
    const ids = asArray(itemId).map((id) => id?.toString());
    if (ids.length === 0) {
        return state;
    }

    return {
        ...state,
        items: state.items.filter((item) => !ids.includes(item.id?.toString())),
    };
};

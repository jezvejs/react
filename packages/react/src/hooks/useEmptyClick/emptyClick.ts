import { isFunction, asArray } from '@jezvejs/types';
import { ge } from '@jezvejs/dom';

export type EmptyClickCallback = () => void;
export type EmptyClickHandler = (e: MouseEvent) => void;

export interface EmptyClickEntry {
    callback: EmptyClickCallback;
    handler: EmptyClickHandler;
}

const clickHandlersMap: EmptyClickEntry[] = [];

/**
 * Handler for click on empty space event
 * @param {Event} e - click event object
 * @param {Function} callback - event handler
 * @param {Element[]} elem - elements to skip handler if click occurs on it
 */
const onEmptyClick = (e: Event, callback: EmptyClickCallback, elem: Element | Element[]) => {
    let notExcluded = true;
    const elems = asArray(elem);

    if (!isFunction(callback)) {
        return;
    }

    if (e) {
        const target = e.target as HTMLElement;

        notExcluded = elems.every((el: string) => {
            const currentElem = ((typeof el === 'string') ? ge(el) : el) || null;
            return ((
                currentElem
                && !currentElem.contains(target)
                && currentElem !== target
            ) || !currentElem);
        });
    }

    if (notExcluded) {
        callback();
    }
};

/** Returns index of 'empty click' handler with specified callback */
const getEmptyClickHandlerIndex = (callback: EmptyClickCallback) => (
    clickHandlersMap.findIndex((item: EmptyClickEntry) => item.callback === callback)
);

/** Set event handler for click by empty place */
export const setEmptyClick = (callback: EmptyClickCallback, elem: Element | Element[]) => {
    if (!document.documentElement || !isFunction(callback)) {
        return;
    }

    setTimeout(() => {
        const ind = getEmptyClickHandlerIndex(callback);
        if (ind !== -1) {
            return;
        }

        const handler = (e: MouseEvent) => onEmptyClick(e, callback, elem);
        clickHandlersMap.push({ callback, handler });

        document.documentElement.addEventListener(
            'click',
            handler,
        );
    });
};

/** Remove previously set event handler for click by empty place */
export const removeEmptyClick = (callback: EmptyClickCallback) => {
    const ind = getEmptyClickHandlerIndex(callback);
    if (ind === -1) {
        return;
    }

    const handlerItem = clickHandlersMap[ind];
    document.documentElement.removeEventListener(
        'click',
        handlerItem.handler,
    );

    clickHandlersMap.splice(ind, 1);
};

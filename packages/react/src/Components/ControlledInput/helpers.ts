import { getCursorPos } from '@jezvejs/dom';
import { ControlledInputEvent } from './types.ts';

/** Obtain from event input data to be inserted */
export const getInputContent = (e: ControlledInputEvent) => {
    if (e.type === 'paste') {
        const ev = e as React.ClipboardEvent<HTMLInputElement>;
        return ev.clipboardData.getData('text');
    }

    if (e.type === 'beforeinput') {
        const ev = e as React.CompositionEvent<HTMLInputElement>;
        return ev.data;
    }

    if (e.type === 'keypress') {
        const ev = e as React.KeyboardEvent<HTMLInputElement>;
        if (ev.keyCode !== 13) {
            return ev.key;
        }
    }

    return null;
};

/**
 * Replace current selection by specified string or insert it to cursor position
 * @param {HTMLInputElement} input - input element
 * @param {string} text - string to insert
 */
export const replaceSelection = (input: HTMLInputElement, text: string): string => {
    const origValue = input.value;

    const range = getCursorPos(input);
    if (!range) {
        return origValue;
    }

    const beforeSelection = origValue.substring(0, range.start);
    const afterSelection = origValue.substring(range.end);

    return beforeSelection + text + afterSelection;
};

import { getCursorPos } from '@jezvejs/dom';

/** Obtain from event input data to be inserted */
export const getInputContent = (e) => {
    if (e.type === 'paste') {
        return (e.clipboardData || window.clipboardData).getData('text');
    }
    if (e.type === 'beforeinput') {
        return e.data;
    }
    if (e.type === 'keypress' && e.keyCode !== 13) {
        return e.key;
    }

    return null;
};

/**
 * Replace current selection by specified string or insert it to cursor position
 * @param {HTMLInputElement} input - input element
 * @param {string} text - string to insert
 */
export const replaceSelection = (input, text) => {
    const range = getCursorPos(input);

    const origValue = input.value;
    const beforeSelection = origValue.substring(0, range.start);
    const afterSelection = origValue.substring(range.end);

    return beforeSelection + text + afterSelection;
};

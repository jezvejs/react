import { getCursorPos } from '@jezvejs/dom';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import { ControlledInput, ControlledInputHelpers } from '../ControlledInput/ControlledInput.tsx';

import {
    dispatchInputEvent,
    fixCursorPos,
    formatDateString,
    getInitialState,
    getRangeTypeByPosition,
    handleExpectedContent,
    removeSeparators,
    renderValue,
    setCursor,
    stepCursor,
} from './helpers.ts';
import { DateInputProps, DateInputReplaceSelectionOptions } from './types.ts';
import { ControlledInputEvent, ControlledInputProps } from '../ControlledInput/types.ts';
import { InputModes } from '../Input/Input.tsx';

const { getInputContent } = ControlledInputHelpers;

const defaultProps: DateInputProps = {
    guideChar: '_',
    locales: [],
};

export * from './types.ts';
export * as DateInputHelpers from './helpers.ts';

export const DateInput: React.FC<DateInputProps> = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };
    const [state, setState] = useState(getInitialState(props));

    // Update locales
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            ...getInitialState(props),
        }));
    }, [props.locales]);

    // Update value
    useEffect(() => {
        const expectedContent = replaceSelection(props.value ?? '', { replaceAll: true });
        setState((prev) => ({
            ...prev,
            ...handleExpectedContent(expectedContent, prev, true),
        }));
    }, [props.value]);

    const deleteSelection = () => {
        const range = {
            start: state.cursorPos,
            end: state.selectionEnd,
        };
        const origValue = renderValue(state);
        const beforeSelection = origValue.substr(0, range.start);
        const afterSelection = origValue.substring(range.end);
        let selection = origValue.substring(range.start, range.end);

        let res = beforeSelection;

        setState((prev) => setCursor(prev, beforeSelection.length));

        while (selection.length) {
            const char = selection.charAt(0);
            selection = selection.substr(1);
            if (state.separator?.includes(char)) {
                res += char;
            } else {
                res += props.guideChar;
            }
        }

        res += afterSelection;

        return res;
    };

    const backspaceHandler = () => {
        const range = {
            start: state.cursorPos,
            end: state.selectionEnd,
        };
        if (range.start !== range.end) {
            return deleteSelection();
        }

        const origValue = renderValue(state);
        let beforeSelection = origValue.substr(0, range.start);
        let afterSelection = origValue.substr(range.end);

        do {
            const char = beforeSelection.charAt(beforeSelection.length - 1);
            beforeSelection = beforeSelection.substr(0, beforeSelection.length - 1);
            if (state.separator?.includes(char)) {
                afterSelection = char + afterSelection;
            } else {
                afterSelection = props.guideChar + afterSelection;
                break;
            }
        } while (beforeSelection.length);

        setState((prev) => setCursor(prev, beforeSelection.length));

        const res = beforeSelection + afterSelection;

        return res;
    };

    const deleteHandler = () => {
        const range = {
            start: state.cursorPos,
            end: state.selectionEnd,
        };
        let char;

        if (range.start !== range.end) {
            return deleteSelection();
        }

        const origValue = renderValue(state);
        const beforeSelection = origValue.substr(0, range.start);
        let afterSelection = origValue.substr(range.end);
        let selection = origValue.substr(range.start);

        let res = beforeSelection;
        let lastCursorPos = beforeSelection.length;

        afterSelection = removeSeparators(afterSelection, state);
        // Remove first character from part after selection
        if (afterSelection.length > 0) {
            afterSelection = props.guideChar + afterSelection.substr(1);
            lastCursorPos += 1;
        }

        const separator = state.separator ?? '';
        while (selection.length > 0) {
            const maskChar = selection.charAt(0);
            selection = selection.substring(1);

            if (separator.includes(maskChar)) {
                res += maskChar;
                if (lastCursorPos === res.length) {
                    lastCursorPos += 1;
                }
            } else {
                if (afterSelection.length > 0) {
                    char = afterSelection.charAt(0);
                    afterSelection = afterSelection.substr(1);
                } else {
                    char = props.guideChar;
                }
                res += char;
            }
        }

        setState((prev) => setCursor(prev, lastCursorPos));

        return res;
    };

    /**
     * Replace current selection by specified string or insert it to cursor position
     * @param {string} text - string to insert
     */
    const replaceSelection = (text: string, options: DateInputReplaceSelectionOptions) => {
        const {
            e = null,
            replaceAll = false,
        } = options;

        if (replaceAll && text.length === 0) {
            return text;
        }

        let origValue = renderValue(state);
        if (origValue.length === 0) {
            origValue = formatDateString(state);
        }

        const range = (replaceAll)
            ? { start: 0, end: origValue.length }
            : getCursorPos(e?.target as Element);

        if (!range) {
            return text;
        }

        range.start = fixCursorPos(range.start, state);
        range.end = fixCursorPos(range.end, state);

        const beforeSelection = origValue.substring(0, range.start);
        const afterSelection = origValue.substring(range.end);
        const selection = origValue.substring(range.start, range.end);

        // Fix length of day and month values: prepend leading zero
        let fixedText = text;
        if (replaceAll) {
            const expectedParts = text.split(state.separator ?? '');
            if (expectedParts.length !== 3) {
                return origValue;
            }

            const dayOrder = state.dayRange?.order ?? null;
            const monthOrder = state.monthRange?.order ?? null;
            const yearOrder = state.yearRange?.order ?? null;
            if (dayOrder === null || monthOrder === null || yearOrder === null) {
                return origValue;
            }

            let day = expectedParts[dayOrder];
            let month = expectedParts[monthOrder];
            const year = expectedParts[yearOrder];

            if (day.length === 1) {
                day = `0${day}`;
            }
            if (month.length === 1) {
                month = `0${month}`;
            }

            fixedText = formatDateString({
                ...state,
                day,
                month,
                year,
            });
        }

        let textValue = removeSeparators(fixedText, state);
        if (!replaceAll) {
            setState((prev) => setCursor(prev, beforeSelection.length));
        }

        // Append input/paste text with guide characters to the length of selection
        const digitsSelection = removeSeparators(selection, state);
        if (textValue.length < digitsSelection.length) {
            fixedText = fixedText.padEnd(digitsSelection.length, props.guideChar);
        }

        // Replace leading guide characters after selection with remain text
        let textCharsRemain = textValue.length - digitsSelection.length;
        let after = removeSeparators(afterSelection, state);
        while (textCharsRemain > 0 && after.substr(0, 1) === props.guideChar) {
            after = after.substring(1);
            textCharsRemain -= 1;
        }
        if (textCharsRemain > 0) {
            return origValue;
        }

        let value = fixedText + after;
        let res = beforeSelection;
        let valueToReplace = selection + afterSelection;
        const separator = state.separator ?? '';
        while (valueToReplace.length > 0) {
            const maskChar = valueToReplace.charAt(0);

            if (separator.includes(maskChar)) {
                res += maskChar;

                const char = value.charAt(0);
                const isSeparatorChar = value.length > 0 && separator.includes(char);

                if (
                    !replaceAll
                    && (textValue.length > 0 || isSeparatorChar)
                ) {
                    setState(stepCursor);
                }

                valueToReplace = valueToReplace.substring(1);

                continue;
            }

            if (value.length > 0) {
                const char = value.charAt(0);
                value = value.substring(1);
                const isSeparatorChar = separator.includes(char);

                if (isSeparatorChar) {
                    const lastSepPos = res.lastIndexOf(separator);
                    const startPos = (lastSepPos !== -1)
                        ? (lastSepPos + separator.length)
                        : 0;

                    const rangeType = getRangeTypeByPosition(state.cursorPos, state);
                    const isDayOrMonth = rangeType === 'day' || rangeType === 'month';

                    if (!replaceAll && isDayOrMonth && state.cursorPos - startPos === 1) {
                        const currentPart = res.substring(startPos, state.cursorPos);
                        const beforeCurrentPart = res.substring(0, startPos);
                        res = `${beforeCurrentPart}0${currentPart}`;

                        setState(stepCursor);

                        valueToReplace = valueToReplace.substring(1);
                    }

                    continue;
                }

                res += char;
                if (textValue.length > 0 && !isSeparatorChar) {
                    if (!replaceAll) {
                        setState(stepCursor);
                    }
                    textValue = textValue.substring(1);
                }
            } else {
                res += props.guideChar;
            }

            valueToReplace = valueToReplace.substring(1);
        }

        return res;
    };

    const onValue = (value: string) => {
        const content = replaceSelection(value, { replaceAll: true });
        const newState = handleExpectedContent(content, state);

        return renderValue({ ...state, ...newState });
    };

    const onSelectCapture = (e: React.SyntheticEvent) => {
        const range = getCursorPos(e.target as Element);
        if (!range) {
            return;
        }

        setState((prev) => ({
            ...prev,
            cursorPos: range.start,
            selectionEnd: range.end,
        }));
    };

    const onValidateInput = (e: ControlledInputEvent) => {
        const { nativeEvent } = e;
        let expectedContent;

        const inputContent = getInputContent(e);
        if (!inputContent || inputContent.length === 0) {
            if (nativeEvent.type !== 'input') {
                return;
            }

            const inputEvent = nativeEvent as InputEvent;
            const { inputType } = inputEvent;

            if (inputType === 'deleteContentBackward') {
                expectedContent = backspaceHandler();
            } else if (inputType === 'deleteContentForward' || inputType === 'deleteByCut') {
                expectedContent = deleteHandler();
            } else {
                return;
            }
        } else {
            expectedContent = replaceSelection(inputContent, { e });
        }

        e.preventDefault();
        e.stopPropagation();

        flushSync(() => {
            setState((prev) => ({
                ...prev,
                ...handleExpectedContent(expectedContent, prev, true),
            }));
        });

        dispatchInputEvent(e.target as HTMLInputElement);
    };

    const inputProps: ControlledInputProps = {
        inputMode: 'decimal' as InputModes,
        selectionStart: state.cursorPos,
        selectionEnd: state.selectionEnd,
        onValidateInput,
        onValue,
        onSelectCapture,
        handleValueProperty: false,
        renderValue: () => renderValue(state),
        placeholder: props.placeholder ?? state.formatMask ?? '',
        onInput: props.onInput,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
        onChange: props.onChange,
        disabled: props.disabled,
        value: props.value,
        id: props.id,
    };

    return (
        <ControlledInput {...inputProps} />
    );
};

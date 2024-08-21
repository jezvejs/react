import { ControlledInputEvent, ControlledInputProps } from '../ControlledInput/types.ts';

export interface DateRange {
    start: number;
    end: number;
}

export interface DateFormatPartType {
    type: string;
    start: number;
    end: number;
    length: number;
    value?: string;
    order?: number;
}

export interface DateFormatType {
    separator: string | null;
    formatParts: DateFormatPartType[];
    dayRange?: DateFormatPartType;
    monthRange?: DateFormatPartType;
    yearRange?: DateFormatPartType;
    formatMask: string | null;
}

export interface DateInputReplaceSelectionOptions {
    e?: ControlledInputEvent | null;
    replaceAll?: boolean;
}

export interface DateInputProps extends ControlledInputProps {
    guideChar?: string,
    locales?: string | string[],
}

export interface DateInputState extends DateInputProps, DateFormatType {
    day: string;
    month: string;
    year: string;

    emptyState: {
        day: string;
        month: string;
        year: string;
    };

    maxLength: number;
    cursorPos: number;
    selectionEnd: number;
    emptyStateValue: string;
}

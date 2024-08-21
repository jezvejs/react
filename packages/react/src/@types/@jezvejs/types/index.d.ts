/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '@jezvejs/types' {
    /** Checks if a parameter is Date */
    declare const isDate: (obj: any) => boolean;

    /** Checks if a parameter is function */
    declare const isFunction: (obj: any) => boolean;

    /** Checks if a parameter is instance of Object */
    declare const isObject: (obj: any) => boolean;

    /** Checks if a parameter is Number or valid number string */
    declare const isNumber: (val: any) => boolean;

    /** Checks if a parameter is integer Number or valid integer string */
    declare const isInteger: (x: any) => boolean;

    /** Checks if a parameter is array */
    declare const isArray: (obj: any) => boolean;

    /** Returns parameter if it is array, else wrap value to array */
    declare const asArray: (value: any | any[] | null | undefined) => any[];
}

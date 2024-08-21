declare module '@jezvejs/dom' {
    /** Return DOM element by id */
    declare const ge: (id: string) => Element | null;

    /**
     * Assign properties from second object to first
     * @param {Object} obj - object to assign properties to
     * @param {Object} props - object to obtain properties from
     */
    declare const setProps: (obj: object, props: object) => void;

    /** Set attributes to specified element */
    declare const setAttributes: (element: Element, attrs: object) => void;

    /**
     * Append child to specified element
     * @param {Element} elem - element to append child to
     * @param {Element[]} childs - element or array of elements to append
     */
    declare const addChilds: (elem: Element, childs: Element | Element[] | null) => void;

    /**
     * Set up event handlers for specified element
     * @param {EventTarget} elem - element to set event handlers
     * @param {object} events - event handlers object
     * @param {boolean|object} options - useCapture flag or options object
     */
    declare const setEvents: (
        elem: EventTarget | null | undefined,
        events: ListenerFunctionsGroup,
        options: boolean | object | undefined = undefined,
    ) => void;

    /**
     * Remove event handlers from specified element
     * @param {EventTarget} elem - element to remove event handlers from
     * @param {object} events - event handlers object
     * @param {boolean|object} options - useCapture flag or options object
     */
    declare const removeEvents: (
        elem: EventTarget | null | undefined,
        events: ListenerFunctionsGroup,
        options: boolean | object | undefined = undefined,
    ) => void;

    declare interface CreateElementOptions {
        props?: object;
        attrs?: object;
        children?: Element | Element[] | string | null;
        events: object;
    }

    /**
     * Applies options to element
     * @param {Element} elem - element to apply options
     * @param {Object} options
     * @param {Object} options.attrs - attributes to set for created element
     * @param {Object} options.props - properties to set for created element
     * @param {Element[]} options.children - element or array of elements to append
     * @param {Object} options.events - event handlers object
     */
    declare const applyElementOptions: (
        elem: Element,
        options: CreateElementOptions = {},
    ) => void;

    /**
     * Creates specified DOM element and sets parameters if specified
     * @param {string} tagName - tag name of element to create
     * @param {Object} options
     * @param {Object} options.attrs - attributes to set for created element
     * @param {Object} options.props - properties to set for created element
     * @param {Element[]} options.children - element or array of elements to append
     * @param {Object} options.events - event handlers object
     */
    declare const createElement: (
        tagName: string,
        options: CreateElementOptions = {},
    ) => Element | null;

    /**
     * Creates specified SVG element and sets parameters if specified
     * @param {string} tagName - tag name of element to create
     * @param {Object} options
     * @param {Object} options.attrs - attributes to set for created element
     * @param {Object} options.props - properties to set for created element
     * @param {Element[]} options.children - element or array of elements to append
     * @param {Object} options.events - event handlers object
     */
    declare const createSVGElement: (
        tagName: string,
        options: CreateElementOptions = {},
    ) => SVGElement | null;

    /** Returns splitted and filtered array of class names */
    declare const getClassNames: (...args: string[]) => string[];

    /** Returns arguments converted to className string */
    declare const getClassName: (...args: string[]) => string;

    declare interface FormDataType {
        [name: string]: string;
    }

    /**
     * Obtain request data of specified form element
     * @param {HTMLFormElement} form - form element to obtain data from
     */
    declare const getFormData: (form: HTMLFormElement) => FormDataType | null;

    /** Return current computed style of element */
    declare const computedStyle: (elem: Element) => React.CSSProperties;

    /**
     * Return visibility of specified element
     * @param {Element|string} target - element to check visibility of
     * @param {boolean} recursive - if set to true will check visibility of all parent nodes
     */
    declare const isVisible: (target: Element | string, recursive: boolean) => boolean;

    /**
     * Show/hide specified element
     * @param {Element|string} target - element or id to show/hide
     * @param {*} val - if set to true then element will be shown, hidden otherwise
     */
    declare const show: (target: Element | string, val: boolean = true) => void;

    /**
     * Enable or disable specified element
     * @param {Element|string} target - element or id to show/hide
     * @param {boolean} val - if set to true then element will be enabled, disable otherwise
     */
    declare const enable: (target: Element | string, val: boolean = true) => void;

    /** Return caret position in specified input control */
    declare const getCaretPos: (elem: Element) => number;

    declare interface CursorPos {
        start: number;
        end: number;
    }

    /**
     * Return curson/selection position for specified input element
     * @param {Element} input
     */
    declare const getCursorPos: (input: Element) => CursorPos | null;

    /**
     * Set curson position for specified input element
     * @param {Element} input
     * @param {number} startPos
     * @param {number} endPos
     */
    declare const selectText: (input: Element, startPos: number, endPos: number) => void;

    /**
     * Set curson position for specified input element
     * @param {Element} input
     * @param {number} pos
     */
    declare const setCursorPos: (input: Element, pos: number) => void;

    /** Return text of selected option of select object */
    declare const selectedText: (selectObj) => string | number;

    /** Return value of selected option of select object */
    declare const selectedValue: (selectObj: Element) => string | number;

    /**
     * Select item with specified value if exist
     * @param {Element} selectObj - select element
     * @param {string} selValue - option value to select
     * @param {boolean} selBool - if set to false then deselect option, select otherwise
     */
    declare const selectByValue: (
        selectObj: Element,
        selValue: string,
        selBool: boolean,
    ) => boolean;

    declare interface Offset {
        left: number;
        top: number;
    }

    /** Calculate offset of element by sum of offsets of parents */
    declare const getOffsetSum: (elem) => Offset;

    /** Calculate offset of element using getBoundingClientRect() method */
    declare const getOffsetRect: (elem) => Offset;

    /** Calculate offset of element */
    declare const getOffset: (elem) => Offset;

    /** Compare position of two node in the document */
    declare const comparePosition: (a: Element, b: Element) => number;

    /** Return page scroll */
    declare const getPageScroll: () => Offset;

    /** Cross-browser find head element */
    declare const head: () => Element | null;

    /** Set cross-browser transform value */
    declare const transform: (elem: HTMLElement, value: string) => void;

    declare type AfterTransitionCallback = () => void;
    declare type CancelTransitionCallback = () => void;

    /**
     * Runs specified callback after transition end or timeout
     * @param {Element} elem
     * @param {Object} options
     * @param {Function} callback
     */
    declare const afterTransition: (
        elem: Element,
        options: object,
        callback: AfterTransitionCallback,
    ) => CancelTransitionCallback;

    /**
     * Restarts animation of element
     * @param {Element} elem
     */
    declare const reflow: (elem: Element) => number | undefined;

    /** Return fixed DPI value */
    declare const getRealDPI: () => number;

    /** Add new DOM ready event handler to the queue */
    declare const onReady: (handler: () => void) => void;

}

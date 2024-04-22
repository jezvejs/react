import {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Local components
import { DatePickerHeader } from '../Header/Header.jsx';
import { DatePickerMonthView } from '../MonthView/MonthView.jsx';
import { DatePickerWeekDaysHeader } from '../WeekDaysHeader/WeekDaysHeader.jsx';
import { DatePickerYearRangeView } from '../YearRangeView/YearRangeView.jsx';
import { DatePickerYearView } from '../YearView/YearView.jsx';

import {
    MIN_DOUBLE_VIEW_SCREEN_WIDTH,
    MONTH_VIEW,
    YEARRANGE_VIEW,
    YEAR_VIEW,
} from '../../constants.js';
import {
    getHeaderTitle,
    getScreenWidth,
} from '../../helpers.js';
import { useDatePickerDispatch, useDatePickerState } from '../../context.jsx';
import { actions } from '../../reducer.js';
import './DatePickerContainer.scss';

// eslint-disable-next-line react/display-name
export const DatePickerContainer = forwardRef((props, ref) => {
    const state = useDatePickerState();
    const dispatch = useDatePickerDispatch();

    const {
        keyboardNavigation,
        vertical,
    } = props;

    const doubleView = useMemo(() => (
        props.doubleView
        && (
            props.vertical
            || getScreenWidth() >= MIN_DOUBLE_VIEW_SCREEN_WIDTH
        )
    ), [props.doubleView, props.vertical]);

    const currViewRef = useRef(null);

    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);

    const onStateReady = () => {
        if (state.waitingForAnimation) {
            return;
        }

        /*
        if (state.focusIndex !== -1) {
            const view = (state.focusSecond) ? this.secondView : this.currView;
            const activeItem = view.items[state.focusIndex];
            if (activeItem) {
                activeItem.elem?.focus();
            }
        }
        */

        dispatch(actions.setReadyState({
            focusIndex: -1,
        }));
    };

    const sendShowEvents = (value = true) => {
        const eventName = (value) ? 'onShow' : 'onHide';
        props[eventName]?.();
    };

    /**
     * Show/hide date picker
     * @param {boolean} visible - if true then show view, hide otherwise
     */
    const show = (visible = true) => {
        dispatch(actions.show(visible));
        sendShowEvents(visible);
    };

    const hide = () => show(false);

    const navigateTo = (action) => {
        if (state.waitingForAnimation) {
            return;
        }

        dispatch(action);

        if (!props.animated) {
            onStateReady();
        }
    };

    const zoomIn = ({ date, secondViewTransition = false }) => {
        const { viewType } = state;
        if (viewType !== YEAR_VIEW && viewType !== YEARRANGE_VIEW) {
            return;
        }

        navigateTo(actions.zoomIn({
            date,
            viewType: (viewType === YEAR_VIEW) ? MONTH_VIEW : YEAR_VIEW,
            transition: 'zoomIn',
            secondViewTransition,
        }));
    };

    const zoomOut = ({ secondViewTransition = false }) => {
        const { viewType } = state;
        if (viewType !== MONTH_VIEW && viewType !== YEAR_VIEW) {
            return;
        }

        navigateTo(actions.zoomOut({
            secondViewTransition,
        }));
    };

    const navigateToPrev = () => {
        navigateTo(actions.navigateToPrev());
    };

    const navigateToNext = () => {
        navigateTo(actions.navigateToNext());
    };

    /**
     * Set up selected items range
     * @param {Date} startDate - date to start selection from
     * @param {Date} endDate  - date to finnish selection at
     */
    const setSelection = (startDate, endDate, navigateToFirst = true) => {
        if (state.waitingForAnimation) {
            return;
        }

        dispatch(actions.setSelection({
            startDate,
            endDate,
            navigateToFirst,
        }));
    };

    /** Range select inner callback */
    const onRangeSelect = (date) => {
        if (state.waitingForAnimation) {
            return;
        }

        const { start } = state.selRange;
        if (!start) {
            dispatch(actions.startRangeSelect(date));
        } else {
            setSelection(start, date, false);

            props.onRangeSelect?.(state.curRange);
        }
    };

    /** Day cell click inner callback */
    const onDayClick = (date) => {
        if (state.waitingForAnimation) {
            return;
        }

        dispatch(actions.selectDay(date));

        props.onDateSelect?.(state.actDate);

        if (props.range) {
            onRangeSelect(date);
        }

        if (props.hideOnSelect) {
            hide();
        }
    };

    const handleItemSelect = (item, { secondViewTransition = false }) => {
        if (!item) {
            return;
        }

        const { viewType, mode } = state;
        if (viewType === MONTH_VIEW && mode === 'date') {
            onDayClick(item.date);
        } else if (viewType === YEAR_VIEW || viewType === YEARRANGE_VIEW) {
            if (
                (viewType === YEAR_VIEW && mode === 'month')
                || (viewType === YEARRANGE_VIEW && mode === 'year')
            ) {
                onDayClick(item.date);
            } else {
                zoomIn({ date: item.date, secondViewTransition });
            }
        }
    };

    const findItemByElement = (elem) => {
        const cell = elem?.closest('.dp__cell');
        const time = cell?.dataset?.date ?? null;
        if (time === null) {
            return {
                item: null,
                index: -1,
                itemView: null,
                secondViewTransition: false,
            };
        }

        const item = {
            date: new Date(parseInt(time, 10)),
        };
        const siblings = Array.from(cell.parentNode?.querySelectorAll('.dp__cell'));
        const index = siblings.indexOf(cell);

        let secondViewTransition = false;
        if (doubleView) {
            const view = elem?.closest('.dp__view-container');
            const previous = view?.previousElementSibling;
            secondViewTransition = previous?.classList?.contains('dp__view-container');
        }

        return {
            item,
            index,
            secondViewTransition,
        };
    };

    const onViewClick = (e) => {
        e.stopPropagation();

        if (!currViewRef?.current || state.waitingForAnimation) {
            return;
        }

        const { item, secondViewTransition } = findItemByElement(e.target);

        handleItemSelect(item, { secondViewTransition });
    };

    const headerEvents = {
        onClickTitle: (options) => zoomOut(options),
        onClickPrev: () => navigateToPrev(),
        onClickNext: () => navigateToNext(),
    };

    const renderDateView = (date, viewState, dateViewRef) => {
        const {
            viewType,
            locales,
            focusable,
            components,
        } = viewState;

        const commonProps = {
            date,
            locales,
            doubleView,
            focusable,
            renderHeader: doubleView && vertical,
            header: {
                ...headerEvents,
                focusable,
                onClickTitle: (options) => zoomOut({
                    ...options,
                    secondViewTransition: true,
                }),
            },
            components: {
                Header: components.Header,
                WeekDaysHeader: components.WeekDaysHeader,
            },
        };

        if (viewType === MONTH_VIEW) {
            return (
                <DatePickerMonthView
                    {...commonProps}
                    firstDay={viewState.firstDay}
                    actDate={viewState.actDate}
                    multiple={viewState.multiple}
                    range={viewState.range}
                    curRange={viewState.curRange}
                    disabledDateFilter={viewState.disabledDateFilter}
                    rangePart={viewState.rangePart}
                    renderWeekdays={!viewState.vertical}
                    showOtherMonthDays={viewState.showOtherMonthDays}
                    fixedHeight={viewState.fixedHeight}
                    ref={dateViewRef}
                />
            );
        }

        if (viewType === YEAR_VIEW) {
            return <DatePickerYearView {...commonProps} ref={dateViewRef} />;
        }

        if (viewType === YEARRANGE_VIEW) {
            return <DatePickerYearRangeView {...commonProps} ref={dateViewRef} />;
        }

        throw new Error('Invalid view type');
    };

    // Header
    const { Header } = props.components;

    const title = getHeaderTitle({
        viewType: state.viewType,
        date: state.date,
        locales: state.locales,
    });

    const header = (
        <Header
            doubleView={doubleView && !vertical}
            {...headerEvents}
            focusable={keyboardNavigation}
            title={title}
        />
    );

    // Weekdays header
    const { WeekDaysHeader } = props.components;
    let weekdays = null;
    if (props.vertical && WeekDaysHeader && state.viewType === MONTH_VIEW) {
        weekdays = (
            <WeekDaysHeader
                locales={props.locales}
                firstDay={props.firstDay}
            />
        );
    }

    // Content
    const currentView = renderDateView(state.date, state, currViewRef);

    const cellsContainer = (
        <div className='dp__view'>
            <div className='dp__slider'>
                {currentView}
            </div>
        </div>
    );

    // Footer
    const { Footer } = props.components;
    const footer = Footer && <Footer {...props.footer} />;

    return (
        <div
            ref={innerRef}
            className={classNames('dp__container', props.className)}
        >
            <div className='dp__wrapper' onClick={onViewClick}>
                {header}
                {weekdays}
                {cellsContainer}
                {footer}
            </div>
        </div>
    );
});

DatePickerContainer.propTypes = {
    /* Additional reducers */
    reducers: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func),
    ]),
    /** Additional CSS classes */
    className: PropTypes.string,
    /** Reference element for popup position */
    relparent: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
    /** Margin between reference element and popup */
    popupMargin: PropTypes.number,
    /** Padding between popup and screen edge */
    popupScreenPadding: PropTypes.number,
    /** Date select mode. Possible values: 'date', 'month', 'year' */
    mode: PropTypes.oneOf(['date', 'month', 'year']),
    /** Initial date to render */
    date: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.number,
    ]),
    /** If enabled component will be rendered on place instead of wrapping it with popup */
    inline: PropTypes.bool,
    /** If enabled popup will be hidden after select date */
    hideOnSelect: PropTypes.bool,
    /** Enables multiple items select mode */
    multiple: PropTypes.bool,
    /** Enables range select mode */
    range: PropTypes.bool,
    /** Columns gap in pixels */
    columnGap: PropTypes.number,
    /** Rows gap in pixels */
    rowGap: PropTypes.number,
    /** If enabled two views of the same type will be rendered */
    doubleView: PropTypes.bool,
    /** If enabled slide axis is changed from horizontal to vertical */
    vertical: PropTypes.bool,
    /** Set current target for range select mode. Possible values: 'start', 'end', null */
    rangePart: PropTypes.oneOf(['start', 'end', null]),
    /** List of locales */
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    /** First day of week */
    firstDay: PropTypes.number,
    /** Enables keyboard navigation by child components */
    keyboardNavigation: PropTypes.bool,
    /** If enabled child components will render days from other month */
    showOtherMonthDays: PropTypes.bool,
    /** If enabled month view will always render 6 weeks */
    fixedHeight: PropTypes.bool,
    /** Enables animation */
    animated: PropTypes.bool,
    /** Callback to set disabled state of items */
    disabledDateFilter: PropTypes.func,
    /** Range selected event handler */
    onRangeSelect: PropTypes.func,
    /** Date selected event handler */
    onDateSelect: PropTypes.func,
    /** Component shown event handler */
    onShow: PropTypes.func,
    /** Component hidden event handler */
    onHide: PropTypes.func,
    /** Props for footer component */
    footer: PropTypes.object,
    components: PropTypes.shape({
        Footer: PropTypes.func,
        Header: PropTypes.func,
        WeekDaysHeader: PropTypes.func,
    }),
};

DatePickerContainer.defaultProps = {
    relparent: null,
    popupMargin: 5,
    popupScreenPadding: 5,
    mode: 'date', // possible values: 'date', 'month', 'year'
    date: new Date(),
    inline: false,
    hideOnSelect: false,
    multiple: false,
    range: false,
    columnGap: 8,
    rowGap: 8,
    doubleView: false,
    vertical: false,
    rangePart: null, // possible values: 'start', 'end' or null
    locales: [],
    firstDay: null,
    keyboardNavigation: true,
    showOtherMonthDays: true,
    fixedHeight: false,
    animated: false,
    disabledDateFilter: null,
    onRangeSelect: null,
    onDateSelect: null,
    onShow: null,
    onHide: null,
    footer: {},
    components: {
        Footer: null,
        Header: DatePickerHeader,
        WeekDaysHeader: DatePickerWeekDaysHeader,
    },
};
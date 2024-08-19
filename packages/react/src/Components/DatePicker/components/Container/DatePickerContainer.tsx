import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

import { usePopupPosition } from '../../../../hooks/usePopupPosition/usePopupPosition.ts';

import { StoreAction, StoreActionObject } from '../../../../utils/Store/Store.ts';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';

// Local components
import { DatePickerMonthView } from '../MonthView/MonthView.tsx';
import { DatePickerYearRangeView } from '../YearRangeView/YearRangeView.tsx';
import { DatePickerYearView } from '../YearView/YearView.tsx';

import {
    MIN_DOUBLE_VIEW_SCREEN_WIDTH,
    MONTH_VIEW,
    YEARRANGE_VIEW,
    YEAR_VIEW,
} from '../../constants.ts';
import {
    getHeaderTitle,
    getNextViewDate,
    getPrevViewDate,
    getScreenWidth,
} from '../../helpers.ts';
import { actions } from '../../reducer.ts';
import {
    DatePickerHeaderProps,
    DatePickerProps,
    DatePickerState,
    DatePickerViewState,
} from '../../types.ts';
import './DatePickerContainer.scss';

type DatePickerContainerProps = DatePickerProps;
type DatePickerContainerRef = HTMLDivElement | null;

// eslint-disable-next-line react/display-name
export const DatePickerContainer = forwardRef<
    DatePickerContainerRef,
    DatePickerContainerProps
>((props, ref) => {
    const store = useStore();

    const getState = () => store?.getState() as DatePickerState ?? null;
    const dispatch = (action: StoreAction) => store?.dispatch(action);

    const state = getState() ?? (props as DatePickerState);

    const {
        keyboardNavigation = true,
        vertical = false,
    } = props;

    const doubleView = useMemo(() => (
        !!props.doubleView
        && (
            !!props.vertical
            || (getScreenWidth() >= MIN_DOUBLE_VIEW_SCREEN_WIDTH)
        )
    ), [props.doubleView, props.vertical]);

    const currViewRef = useRef<HTMLDivElement | null>(null);
    const secondViewRef = useRef<HTMLDivElement | null>(null);

    const innerRef = useRef(null);
    useImperativeHandle<DatePickerContainerRef, DatePickerContainerRef>(ref, () => (
        innerRef?.current
    ));

    // Popup position
    const { referenceRef, elementRef } = usePopupPosition({
        ...(state?.position ?? {}),
        open: (state?.visible ?? false),
    });

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
    const show = (visible: boolean = true) => {
        const changed = state.visible !== visible;

        dispatch(actions.show(visible));

        if (changed) {
            sendShowEvents(visible);
        }
    };

    const hide = () => show(false);

    const navigateTo = (action: StoreActionObject) => {
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

    /** Clears selected items range */
    const clearSelection = () => {
        if (state.waitingForAnimation) {
            return;
        }

        dispatch(actions.clearSelection());
    };

    const setDisabledDateFilter = (disabledDateFilter) => {
        if (state.waitingForAnimation) {
            return;
        }

        dispatch(actions.setDisabledDateFilter(disabledDateFilter));
    };

    const setRangePart = (rangePart) => {
        if (state.waitingForAnimation) {
            return;
        }

        dispatch(actions.setRangePart(rangePart));
    };

    /** Range select inner callback */
    const onRangeSelect = (date: Date) => {
        if (state.waitingForAnimation) {
            return;
        }

        const { start } = state.selRange;
        if (!start) {
            dispatch(actions.startRangeSelect(date));
        } else {
            setSelection(start, date, false);

            const newState = getState() as DatePickerState;
            const { curRange } = newState;
            props.onRangeSelect?.(curRange, newState);
        }
    };

    /** Day cell click inner callback */
    const onDayClick = (date: Date) => {
        if (state.waitingForAnimation) {
            return;
        }

        dispatch(actions.selectDay(date));

        const newState = getState() as DatePickerState;
        const { actDate } = newState;
        props.onDateSelect?.(actDate, newState);

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
            secondViewTransition = previous?.classList?.contains('dp__view-container') ?? false;
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

    const renderDateView = (
        date: Date,
        viewState: DatePickerViewState,
        dateViewRef: React.MutableRefObject<HTMLDivElement | null>,
    ) => {
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

    // Update visibility of component
    useEffect(() => {
        show(props.visible);
    }, [props.visible]);

    // Update selection
    useEffect(() => {
        if (!props.startDate && !props.endDate) {
            clearSelection();
        } else {
            setSelection(props.startDate, props.endDate);
        }
    }, [props.startDate, props.endDate]);

    // Update disabled date filter
    useEffect(() => {
        setDisabledDateFilter(props.disabledDateFilter);
    }, [props.disabledDateFilter]);

    // Update range part
    useEffect(() => {
        setRangePart(props.rangePart);
    }, [props.rangePart]);

    const currentDate = (state.doubleView && state.secondViewTransition)
        ? getPrevViewDate(state.date, state.viewType)
        : state.date;

    const nextDate = (state.secondViewTransition)
        ? state.date
        : getNextViewDate(state.date, state.viewType);

    // Header
    const { Header } = state.components;

    const title = getHeaderTitle({
        viewType: state.viewType,
        date: currentDate,
        locales: state.locales,
    });

    const headerProps: DatePickerHeaderProps = {
        ...headerEvents,
        doubleView: doubleView && !vertical,
        focusable: keyboardNavigation,
        title,
    };

    if (doubleView) {
        headerProps.secondTitle = getHeaderTitle({
            viewType: state.viewType,
            date: nextDate,
            locales: state.locales,
        });
    }

    const header = Header && (
        <Header {...headerProps} />
    );

    // Weekdays header
    const { WeekDaysHeader } = state.components;
    let weekdays: JSX.Element | null = null;
    if (props.vertical && WeekDaysHeader && state.viewType === MONTH_VIEW) {
        weekdays = (
            <WeekDaysHeader
                locales={props.locales}
                firstDay={props.firstDay}
            />
        );
    }

    // Content
    const viewState: DatePickerViewState = {
        ...state,
        focusable: keyboardNavigation,
    };
    const currentView = renderDateView(currentDate, viewState, currViewRef);

    const secondView = state.doubleView && (
        renderDateView(nextDate, viewState, secondViewRef)
    );

    const cellsContainer = (
        <div className='dp__view'>
            <div className='dp__slider'>
                {currentView}
                {secondView}
            </div>
        </div>
    );

    // Footer
    const { Footer } = state.components;
    const footer = !!Footer && <Footer {...state.footer} />;

    // Container props
    const contProps = {
        className: classNames(
            'dp__container',
            {
                dp__horizontal: !props.vertical,
                dp__vertical: !!props.vertical,
                'dp__double-view': !!props.doubleView,
            },
            props.className,
        ),
    };

    // Wrapper props
    const wrapperProps = {
        className: classNames(
            'dp__wrapper',
            {
                'dp__inline-wrapper': props.inline,
                'dp__double-view': props.doubleView,
            },
        ),
        onClick: onViewClick,
    };

    const datePicker = (
        <div {...contProps} ref={innerRef} >
            <div {...wrapperProps} ref={elementRef} >
                {header}
                {weekdays}
                {cellsContainer}
                {footer}
            </div>
        </div>
    );

    if (props.inline) {
        return datePicker;
    }

    const container = props.container ?? document.body;

    return (
        <>
            <div ref={referenceRef}>
                {props.children}
            </div>
            {state.visible && !state.fixed && datePicker}
            {state.visible && state.fixed && (
                createPortal(datePicker, container)
            )}
        </>
    );
});

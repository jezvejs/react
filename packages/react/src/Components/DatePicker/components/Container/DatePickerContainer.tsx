import { asArray } from '@jezvejs/types';
import classNames from 'classnames';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import { createPortal } from 'react-dom';

// Utils
import { StoreActionObject } from '../../../../utils/Store/Store.ts';
import { useStore } from '../../../../utils/Store/StoreProvider.tsx';
import { AnimationStages } from '../../../../utils/types.ts';
import { minmax, px } from '../../../../utils/common.ts';

// Hooks
import { useAnimationStage } from '../../../../hooks/useAnimationStage/useAnimationStage.tsx';
import { usePopupPosition } from '../../../../hooks/usePopupPosition/usePopupPosition.ts';
import { useSlidable } from '../../../../hooks/useSlidable/useSlidable.tsx';

// Shared components
import { formatOffsetMatrix } from '../../../Sortable/helpers.ts';

// Local components
import { DatePickerMonthView } from '../MonthView/MonthView.tsx';
import { DatePickerYearRangeView } from '../YearRangeView/YearRangeView.tsx';
import { DatePickerYearView } from '../YearView/YearView.tsx';

import {
    MIN_DOUBLE_VIEW_SCREEN_WIDTH,
    MONTH_VIEW,
    SWIPE_THRESHOLD,
    YEARRANGE_VIEW,
    YEAR_VIEW,
} from '../../constants.ts';
import {
    getHeaderTitle,
    getHeight,
    getScreenWidth,
    getViewItems,
    getViewDates,
    getViewItemDate,
    getWidth,
    isSlideTransition,
    isZoomTransition,
    getViewItemBox,
    formatMatrixTransform,
} from '../../helpers.ts';
import { actions } from '../../reducer.ts';
import {
    DatePickerDisabledDateFilter,
    DatePickerHeaderProps,
    DatePickerItem,
    DatePickerProps,
    DatePickerRangePart,
    DatePickerSearchResults,
    DatePickerState,
    DatePickerTitleClickParams,
    DatePickerViewState,
    DatePickerViewTransform,
    DatePickerZoomInParams,
    DatePickerZoomOutParams,
} from '../../types.ts';
import './DatePickerContainer.scss';

type DatePickerContainerProps = DatePickerProps;
type DatePickerContainerRef = HTMLDivElement | null;
type DatePickerSliderRef = HTMLDivElement | null;
type DatePickerCellsContainerRef = HTMLDivElement | null;

type DragZoneRef = Element | null;
type DropTargetRef = Element | null;

interface GetViewHeightsParam {
    prev?: HTMLDivElement | null;
    current: HTMLDivElement | null;
    second?: HTMLDivElement | null;
    next?: HTMLDivElement | null;
}

interface ViewHeights {
    prev?: number;
    current?: number;
    second?: number;
    next?: number;
    header?: number;
}

interface DatePickerViewsRefs {
    previous?: React.MutableRefObject<HTMLDivElement | null>;
    current?: React.MutableRefObject<HTMLDivElement | null>;
    second?: React.MutableRefObject<HTMLDivElement | null>;
    next?: React.MutableRefObject<HTMLDivElement | null>;
}

interface DatePickerRenderViewsParams {
    renderOutside: boolean;
    refs: DatePickerViewsRefs;
}

// eslint-disable-next-line react/display-name
export const DatePickerContainer = forwardRef<
    DatePickerContainerRef,
    DatePickerContainerProps
>((props, ref) => {
    const { getState, dispatch } = useStore<DatePickerState>();
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

    const prevViewRef = useRef<HTMLDivElement | null>(null);
    const currViewRef = useRef<HTMLDivElement | null>(null);
    const secondViewRef = useRef<HTMLDivElement | null>(null);
    const nextViewRef = useRef<HTMLDivElement | null>(null);

    const targetViewRef = useRef<HTMLDivElement | null>(null);
    const secondTargetViewRef = useRef<HTMLDivElement | null>(null);

    const headerRef = useRef<HTMLDivElement | null>(null);

    const sliderRef = useRef<DatePickerSliderRef>(null);
    const cellsContainerRef = useRef<HTMLDivElement | null>(null);

    const zoomSourceRef = useRef<HTMLDivElement | null>(null);
    const zoomTargetRef = useRef<HTMLDivElement | null>(null);

    const resizeRequestedRef = useRef<boolean>(false);
    const waitingForAnimationRef = useRef<boolean>(false);
    const rebuildContentRef = useRef<boolean>(true);
    const viewHeightsRef = useRef<ViewHeights | null>(null);
    const prevHeightsRef = useRef<ViewHeights | null>(null);

    const innerRef = useRef<DatePickerContainerRef>(null);
    useImperativeHandle<DatePickerContainerRef, DatePickerContainerRef>(ref, () => (
        innerRef?.current
    ));

    // Popup position
    const { referenceRef, elementRef } = usePopupPosition({
        ...(state?.position ?? {}),
        open: (state?.visible ?? false),
    });

    const waitingForAnimation = useMemo(() => (
        waitingForAnimationRef.current
    ), [waitingForAnimationRef.current]);

    const onStateReady = () => {
        if (waitingForAnimation) {
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

    const getNextSlideHeight = (st: DatePickerState): number => {
        if (!isSlideTransition(st)) {
            return 0;
        }
        viewHeightsRef.current = getViewsHeights({
            current: targetViewRef.current,
            second: secondTargetViewRef.current,
        });

        const isSlideNext = (!!st.next && st.date < st.next?.date);
        const heights = viewHeightsRef.current;
        const current = (isSlideNext) ? heights.next : heights.prev;

        let second;
        if (doubleView) {
            second = (isSlideNext) ? heights.second : heights.current;
        }

        const height = getContainerHeight({
            current,
            second,
        });
        dispatch(actions.resize({
            height,
        }));

        return height;
    };

    // Component animation
    const animation = useAnimationStage<DatePickerContainerRef, DatePickerViewTransform>({
        ref: innerRef,
        targetRef: () => (
            isZoomTransition(getState()) ? zoomSourceRef : innerRef
        ),
        // id: props.id!, TODO: generate ids
        id: 'testtesttest',
        transform: null,
        transitionTimeout: 500,
        isTransformApplied: (transform: DatePickerViewTransform | null) => (
            !!transform?.transform
        ),
        onEntering: () => {
            const st = getState();
            if (isSlideTransition(st)) {
                const height = getNextSlideHeight(st);
                if (height > 0) {
                    dispatch(actions.resize({ height }));
                }
            } else if (isZoomTransition(st)) {
                viewHeightsRef.current = getViewsHeights({
                    current: targetViewRef.current,
                    second: secondTargetViewRef.current,
                });

                const height = getContainerHeight(viewHeightsRef.current);
                dispatch(actions.resize({ height }));
            }
        },
        onExiting: () => {
            animation.setTransform(null);
            dispatch(actions.finishNavigate());
            waitingForAnimationRef.current = false;
            setDefaultContentPosition();
        },
    });

    const isEntered = animation.stage === AnimationStages.entered;
    const isEntering = animation.stage === AnimationStages.entering;
    const isExiting = animation.stage === AnimationStages.exiting;
    const isExited = animation.stage === AnimationStages.exited;

    const sendShowEvents = (value = true) => {
        const eventName = (value) ? 'onShow' : 'onHide';
        props[eventName]?.();
    };

    /**
     * Show/hide date picker
     * @param {boolean} visible - if true then show view, hide otherwise
     */
    const show = (visible: boolean = true) => {
        const changed = getState().visible !== visible;

        dispatch(actions.show(visible));

        if (changed) {
            sendShowEvents(visible);
        }
    };

    const hide = () => show(false);

    const navigateTo = (action: StoreActionObject) => {
        if (waitingForAnimation) {
            return;
        }

        dispatch(action);

        if (!props.animated) {
            onStateReady();
        }
    };

    const zoomIn = (params: DatePickerZoomInParams) => {
        const { date, secondViewTransition = false } = params;
        const { viewType } = getState();
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

    const zoomOut = (params: DatePickerZoomOutParams) => {
        const { viewType } = getState();
        if (viewType !== MONTH_VIEW && viewType !== YEAR_VIEW) {
            return;
        }

        const { secondViewTransition = false } = params;

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
     * @param {Date|null} startDate - date to start selection from
     * @param {Date|null} endDate  - date to finnish selection at
     */
    const setSelection = (
        startDate: Date | null,
        endDate: Date | null,
        navigateToFirst: boolean = true,
    ) => {
        if (waitingForAnimation) {
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
        if (waitingForAnimation) {
            return;
        }

        dispatch(actions.clearSelection());
    };

    const setDisabledDateFilter = (disabledDateFilter: DatePickerDisabledDateFilter | null) => {
        if (waitingForAnimation) {
            return;
        }

        dispatch(actions.setDisabledDateFilter(disabledDateFilter));
    };

    const setRangePart = (rangePart: DatePickerRangePart | null) => {
        if (waitingForAnimation) {
            return;
        }

        dispatch(actions.setRangePart(rangePart));
    };

    /** Range select inner callback */
    const onRangeSelect = (date: Date) => {
        if (waitingForAnimation) {
            return;
        }

        const { start } = getState().selRange;
        if (!start) {
            dispatch(actions.startRangeSelect(date));
        } else {
            setSelection(start, date, false);

            const newState = getState();
            const { curRange } = newState;
            props.onRangeSelect?.(curRange, newState);
        }
    };

    /** Day cell click inner callback */
    const onDayClick = (date: Date) => {
        if (waitingForAnimation) {
            return;
        }

        dispatch(actions.selectDay(date));

        const newState = getState();
        const activeDates = asArray(newState.actDate);
        if (activeDates.length > 0) {
            const [actDate] = activeDates;
            props.onDateSelect?.(actDate, newState);
        }

        if (props.range) {
            onRangeSelect(date);
        }

        if (props.hideOnSelect) {
            hide();
        }
    };

    const handleItemSelect = (item: DatePickerItem, { secondViewTransition = false }) => {
        if (!item) {
            return;
        }

        const { viewType, mode } = getState();
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

    const findItemByElement = (elem: HTMLElement): DatePickerSearchResults => {
        const cell = elem?.closest('.dp__cell') as HTMLElement;
        const time = cell?.dataset?.date ?? null;
        if (time === null) {
            return {
                item: null,
                index: -1,
                itemView: null,
                secondViewTransition: false,
            };
        }

        const item: DatePickerItem = {
            date: new Date(parseInt(time, 10)),
        };

        const elems = cell.parentNode?.querySelectorAll?.('.dp__cell') ?? [];
        const siblings = Array.from(elems);
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

    const onViewClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!currViewRef.current || waitingForAnimation) {
            return;
        }

        const target = e.target as HTMLElement;
        const { item, secondViewTransition } = findItemByElement(target);
        if (item) {
            handleItemSelect(item, { secondViewTransition });
        }
    };

    const setContentPosition = (position: number) => {
        if (!currViewRef.current || waitingForAnimation) {
            return;
        }

        const st = getState();
        const size = (vertical) ? st.height : st.width;
        const sliderPosition = minmax(-size * 2, size, position);

        dispatch(actions.setSliderPosition(sliderPosition));
    };

    const getSlideWidth = () => (
        (doubleView)
            ? ((getState().width - (props.columnGap ?? 0)) / 2)
            : getState().width
    );

    const getSlideHeight = (index: number, heights?: ViewHeights | null) => {
        const viewHeights = heights ?? viewHeightsRef.current;
        if (!viewHeights) {
            return 0;
        }

        const {
            prev,
            current,
            second,
            next,
        } = viewHeights;

        const resHeights = (doubleView)
            ? [prev, current, second, next]
            : [prev, current, next];

        return resHeights[index + 1] ?? 0;
    };

    const getSlideSize = (index: number, heights?: ViewHeights | null) => (
        (props.vertical) ? getSlideHeight(index, heights) : getSlideWidth()
    );

    const getSlidesGap = () => {
        if (!doubleView) {
            return 0;
        }

        return ((props.vertical) ? props.rowGap : props.columnGap) ?? 0;
    };

    const getSlidePosition = (index: number, heights?: ViewHeights | null) => {
        const viewHeights = heights ?? viewHeightsRef.current;
        const gap = getSlidesGap();

        let res = 0;
        for (let slide = -1; slide < index; slide += 1) {
            res -= getSlideSize(slide, viewHeights) + gap;
        }

        if (doubleView && props.vertical) {
            res -= viewHeights?.header ?? 0;
        }

        return res;
    };

    const setDefaultContentPosition = () => {
        if (!currViewRef.current || waitingForAnimation) {
            return;
        }

        const contentPos = getSlidePosition(0);
        setContentPosition(contentPos);
    };

    const slideTo = (index: number) => {
        const st = getState();
        const targetPos = getSlidePosition(index, prevHeightsRef.current);
        const distance = targetPos - st.sliderPosition;
        if (distance === 0) {
            return;
        }

        waitingForAnimationRef.current = true;

        const x = (vertical) ? 0 : distance;
        const y = (vertical) ? distance : 0;
        const transform = formatOffsetMatrix({ x, y });

        const height = getContainerHeight(viewHeightsRef.current!);

        animation.clearTransition();
        animation.setStage(AnimationStages.exited);

        animation.setTransform({ transform, height });
    };

    const zoom = () => {
        const st = getState();
        if (!st.next) {
            return;
        }

        const { secondViewTransition } = st;
        const zoomingOut = st.transition === 'zoomOut';
        const cellView = ((zoomingOut) ? targetViewRef : currViewRef).current;
        const secondCellView = ((zoomingOut) ? secondTargetViewRef : secondViewRef).current;
        if (!cellView || (doubleView && !secondCellView)) {
            return;
        }

        let relView;
        let relViewType;
        let relViewDate;
        if (secondViewTransition) {
            relView = ((zoomingOut) ? secondViewRef : secondTargetViewRef).current;
            relViewType = (zoomingOut) ? st.next?.viewType : st.viewType;
            relViewDate = (zoomingOut) ? st.next?.date : st.date;
        } else {
            relView = ((zoomingOut) ? currViewRef : targetViewRef).current;
            relViewType = (zoomingOut) ? st.viewType : st.next?.viewType;
            relViewDate = (zoomingOut) ? st.date : st.next?.date;
        }
        if (!relView) {
            return;
        }

        waitingForAnimationRef.current = true;

        const relYear = relViewDate.getFullYear();
        const relMonth = relViewDate.getMonth();

        // Search for target cell on navigate from month view to year view or
        // from year view to years range view
        const isRelativeItem = (el: HTMLElement): boolean => {
            const itemDate = getViewItemDate(el);
            const res = !!itemDate && (
                (
                    relViewType === MONTH_VIEW
                    && itemDate.getFullYear() === relYear
                    && itemDate.getMonth() === relMonth
                ) || (
                    relViewType === YEAR_VIEW
                    && itemDate.getFullYear() === relYear
                )
            );

            return res;
        };

        let cellElem = getViewItems(cellView).find(isRelativeItem);
        if (!cellElem && doubleView) {
            cellElem = getViewItems(secondCellView).find(isRelativeItem);
        }

        const cell = getViewItemBox(cellElem ?? null, st);
        if (!cell) {
            waitingForAnimationRef.current = false;
            return;
        }

        const scaleX = cell.width / st.width;
        const scaleY = cell.height / st.height;
        const cellTrans = [scaleX, 0, 0, scaleY, cell.x, cell.y];
        const viewTrans = [
            1 / scaleX,
            0,
            0,
            1 / scaleY,
            -cell.x / scaleX,
            -cell.y / scaleY,
        ];

        animation.cancel();

        const source = (zoomingOut) ? cellTrans : viewTrans;
        const target = (zoomingOut) ? viewTrans : cellTrans;

        animation.setTransform({
            transform: formatMatrixTransform(source),
            targetTransform: formatMatrixTransform(target),
        });
    };

    const onSlideEnd = (position: number, distance: number, velocity: number) => {
        const passThreshold = Math.abs(velocity) > SWIPE_THRESHOLD;
        const slideSize = getSlideSize(0);
        const gap = getSlidesGap();

        let slideNum = -position / (slideSize + gap);
        if (passThreshold) {
            slideNum = (distance > 0) ? Math.ceil(slideNum) : Math.floor(slideNum);
        } else {
            slideNum = Math.round(slideNum);
        }

        const num = minmax(-1, 1, slideNum - 1);
        if (num === 0) {
            slideTo(0);
            return;
        }

        if (num > 0) {
            navigateToNext();
        } else {
            navigateToPrev();
        }

        setDefaultContentPosition();
    };

    const headerEvents = {
        onClickTitle: zoomOut,
        onClickPrev: navigateToPrev,
        onClickNext: navigateToNext,
    };

    const renderDateView = (
        date: Date,
        viewState: DatePickerViewState,
        dateViewRef: React.MutableRefObject<HTMLDivElement | null> | null | undefined,
    ) => {
        const {
            viewType,
            locales,
            focusable,
            components,
        } = viewState;

        const refProps = (dateViewRef)
            ? { ref: dateViewRef }
            : {};

        const commonProps = {
            date,
            locales,
            doubleView,
            focusable,
            renderHeader: doubleView && vertical,
            header: {
                ...headerEvents,
                focusable,
                onClickTitle: (options: DatePickerTitleClickParams) => zoomOut({
                    ...options,
                    secondViewTransition: true,
                }),
            },
            components: {
                Header: components.Header,
                WeekDaysHeader: components.WeekDaysHeader,
            },
            ...refProps,
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
                />
            );
        }

        if (viewType === YEAR_VIEW) {
            return <DatePickerYearView {...commonProps} />;
        }

        if (viewType === YEARRANGE_VIEW) {
            return <DatePickerYearRangeView {...commonProps} />;
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

    /** Returns array of heights of all views */
    const getViewsHeights = (views?: GetViewHeightsParam) => {
        const prev = views?.prev ?? prevViewRef.current;
        const current = views?.current ?? currViewRef.current;
        const next = views?.next ?? nextViewRef.current;

        const res: ViewHeights = {
            prev: getHeight(prev),
            current: getHeight(current),
            next: getHeight(next),
        };

        if (doubleView) {
            const second = views?.second ?? secondViewRef.current;
            res.second = getHeight(second);
        }
        if (doubleView && vertical) {
            res.header = getHeight(headerRef.current);
        }

        return res;
    };

    /** Returns height of container required to fit all views */
    const getContainerHeight = (heights: ViewHeights) => {
        const childHeights = [];
        if (heights.current) {
            childHeights.push(heights.current);
        }

        if (doubleView && heights.second) {
            childHeights.push(heights.second);
        }

        // For horizontal layout return maximal height
        if (!vertical) {
            return Math.max(...childHeights);
        }

        // For vertical layout return sum of all views and gaps between
        const gapsHeight = (props.rowGap ?? 0) * (childHeights.length - 1);
        let res = childHeights.reduce((sum, item) => (sum + item), 0) + gapsHeight;

        if (doubleView && vertical) {
            res -= heights.header ?? 0;
        }

        return res;
    };

    const onResize = () => {
        if (!currViewRef || waitingForAnimation) {
            resizeRequestedRef.current = true;
            return;
        }

        viewHeightsRef.current = getViewsHeights();
        const containerHeight = getContainerHeight(viewHeightsRef.current);
        if (containerHeight === 0) {
            resizeRequestedRef.current = true;
            return;
        }

        resizeRequestedRef.current = false;

        const cellsContainer = cellsContainerRef.current;
        const width = getWidth(cellsContainer);
        const height = containerHeight;

        if (cellsContainer) {
            cellsContainer.style.height = px(containerHeight);
        }

        setDefaultContentPosition();

        dispatch(actions.resize({
            doubleView,
            width,
            height,
            date: state.date,
        }));
    };

    useEffect(() => {
        const container = innerRef?.current as HTMLElement;
        if (!container?.offsetParent) {
            return undefined;
        }

        const observer = new ResizeObserver(onResize);
        observer.observe(container.offsetParent);

        return () => {
            observer.disconnect();
        };
    }, [innerRef]);

    // Measure dimensions of views
    useEffect(() => {
        viewHeightsRef.current = getViewsHeights(/* views */);
        const width = getWidth(cellsContainerRef.current);
        const height = getContainerHeight(viewHeightsRef.current);

        dispatch(actions.resize({ width, height }));
    }, [state.date, state.viewType]);

    /**
     * Mouse whell event handler
     * @param {Event} ev - wheel event object
     */
    const onWheel = (ev: Event) => {
        const e = ev as WheelEvent;
        if (waitingForAnimation) {
            return;
        }

        if (e.deltaY > 0) {
            navigateToPrev();
        } else {
            navigateToNext();
        }
    };

    const { dragZoneRef, dropTargetRef } = useSlidable({
        id: 'slidable', // TODO : generate id! ??,
        vertical,

        updatePosition: setContentPosition,

        isReady: () => !waitingForAnimation,

        onWheel,
        onSlideEnd,

        onDragCancel() {
            slideTo(state.slideIndex ?? 0);
        },
    });

    useImperativeHandle<DragZoneRef, DatePickerSliderRef>(dragZoneRef, () => (
        sliderRef.current
    ));
    useImperativeHandle<DropTargetRef, DatePickerCellsContainerRef>(dropTargetRef, () => (
        cellsContainerRef.current
    ));

    useEffect(() => {
        const st = getState();

        if (
            !st.next
            || animation.stage !== AnimationStages.exited
            || waitingForAnimation
        ) {
            return;
        }

        if (isSlideTransition(st)) {
            const isNext = st.next.date > state.date;
            slideTo(isNext ? 1 : -1);
            return;
        }

        if (isZoomTransition(st)) {
            zoom();
        }
    }, [
        state.transition,
        state.date,
        state.viewType,
        state.next,
        animation.stage,
        waitingForAnimation,
    ]);

    const isZoom = isZoomTransition(getState());

    // Render views
    const viewDates = getViewDates(state);

    // Header
    const { Header } = state.components;

    const title = getHeaderTitle({
        viewType: state.viewType,
        date: viewDates.current,
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
            date: viewDates.next,
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

    const RenderViews = (st: DatePickerViewState, options: DatePickerRenderViewsParams) => {
        const {
            renderOutside = true,
            refs,
        } = options;

        const res = useMemo(() => {
            const prevView = renderOutside && (
                renderDateView(viewDates.previous, st, refs?.previous)
            );
            const currentView = renderDateView(viewDates.current, st, refs?.current);

            const secondView = state.doubleView && (
                renderDateView(viewDates.second, st, refs?.second)
            );

            const nextView = renderOutside && renderDateView(viewDates.next, st, refs?.next);

            return (
                <>
                    {prevView}
                    {currentView}
                    {doubleView && secondView}
                    {nextView}
                </>
            );
        }, [
            st.date,
            st.doubleView,
            st.viewType,
            st.locales,
            st.slideIndex,
            renderOutside,
        ]);

        return res;
    };

    // Content
    const viewState: DatePickerViewState = {
        ...state,
        focusable: keyboardNavigation,
    };

    const views = RenderViews(viewState, {
        renderOutside: !isZoom,
        refs: {
            previous: prevViewRef,
            current: currViewRef,
            second: secondViewRef,
            next: nextViewRef,
        },
    });

    const cellsContainerProps: React.HTMLAttributes<HTMLDivElement> = {
        className: classNames(
            'dp__view',
            {
                'dp__animated-view': state.animated && (isEntering || isEntered),
            },
        ),
        style: {},
    };

    const sliderProps: React.HTMLAttributes<HTMLDivElement> = {
        className: 'dp__slider',
        style: {},
    };

    // Rebuild content
    useEffect(() => {
        if (
            !currViewRef.current
            || rebuildContentRef.current
            || !props.animated
        ) {
            if (state.width > 0) {
                setDefaultContentPosition();
            }

            viewHeightsRef.current = getViewsHeights();
            const height = getContainerHeight(viewHeightsRef.current);

            dispatch(actions.resize({ height }));
        }
    }, [currViewRef.current, rebuildContentRef.current, props.animated]);

    if (
        !currViewRef.current
        || rebuildContentRef.current
        || !props.animated
    ) {
        sliderProps.style!.transform = '';
        cellsContainerProps.style!.width = '';

        rebuildContentRef.current = false;
    }

    if (state.width > 0) {
        cellsContainerProps.style!.width = px(state.width);
    }
    cellsContainerProps.style!.height = px(state.height);

    if (vertical) {
        sliderProps.style!.top = px(state.sliderPosition);
    } else {
        sliderProps.style!.left = px(state.sliderPosition);
    }

    let viewContent;

    const nextViewState: DatePickerViewState = {
        ...state,
        viewType: state.next?.viewType ?? state.viewType,
        focusable: keyboardNavigation,
    };

    // TODO : don't render next views every time (currently requeired due to useMemo()
    // hook inside RenderViews() function)
    const nextViews = RenderViews(nextViewState, {
        renderOutside: false,
        refs: {
            current: targetViewRef,
            second: secondTargetViewRef,
        },
    });

    const transform = animation.transform?.transform ?? '';
    if (isZoom) {
        const zoomingOut = state.transition === 'zoomOut';

        const sourceProps: React.HTMLAttributes<HTMLDivElement> = {
            className: classNames(
                'dp__layered-view',
                (zoomingOut) ? 'bottom_to' : 'top_to',
            ),
            style: {
                transform: (
                    (isEntered || isExiting) ? transform : ''
                ),
                opacity: (isEntered || isExiting) ? 0 : 1,
            },
        };

        const targetTransform = animation.transform?.targetTransform ?? '';
        const targetProps: React.HTMLAttributes<HTMLDivElement> = {
            className: classNames(
                'dp__layered-view',
                (zoomingOut) ? 'top_from' : 'bottom_from',
            ),
            style: {
                transform: (
                    (isExited || isEntering) ? targetTransform : ''
                ),
                opacity: (isExiting || isEntered) ? 1 : 0,
            },
        };

        viewContent = (
            <>
                <div {...targetProps} ref={zoomTargetRef}>
                    {nextViews}
                </div>
                <div {...sourceProps} ref={zoomSourceRef}>
                    {views}
                </div>
            </>
        );
    } else {
        sliderProps.style!.transform = (isEntered || isExiting) ? transform : '';

        viewContent = (
            <div {...sliderProps} ref={sliderRef} >
                {views}
            </div>
        );
    }

    const cellsContainer = (
        <div {...cellsContainerProps} ref={cellsContainerRef} >
            {viewContent}
        </div>
    );

    // Footer
    const { Footer } = state.components;
    const footer = !!Footer && <Footer {...state.footer} />;

    // Container props
    const contProps = useMemo(() => ({
        className: classNames(
            'dp__container',
            {
                dp__horizontal: !props.vertical,
                dp__vertical: !!props.vertical,
                'dp__double-view': !!props.doubleView,
            },
            props.className,
        ),
    }), [props.vertical, props.doubleView, props.className]);

    // Wrapper props
    const wrapperProps = useMemo(() => ({
        className: classNames(
            'dp__wrapper',
            {
                'dp__inline-wrapper': props.inline,
                'dp__double-view': props.doubleView,
                dp__animated: props.animated && (isEntering || isEntered),
            },
        ),
        onClick: onViewClick,
    }), [
        props.inline,
        props.vertical,
        props.doubleView,
        props.className,
        props.animated,
        animation.stage,
    ]);

    // Set 'rebuild content' flag on change 'doubleView' state
    useEffect(() => {
        rebuildContentRef.current = true;
    }, [state.doubleView]);

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

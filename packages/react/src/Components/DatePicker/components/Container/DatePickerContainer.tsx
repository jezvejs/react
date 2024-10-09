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
import { AnimationStages, StyledHTMLAttributes } from '../../../../utils/types.ts';
import { minmax, px } from '../../../../utils/common.ts';

// Hooks
import { useAnimationStage } from '../../../../hooks/useAnimationStage/useAnimationStage.tsx';
import { usePopupPosition } from '../../../../hooks/usePopupPosition/usePopupPosition.ts';
import { useSlidable } from '../../../../hooks/useSlidable/useSlidable.tsx';

// Shared components
import { formatOffsetMatrix } from '../../../Sortable/helpers.ts';

// Local components
import { DatePickerDateView } from '../DateView/DateView.tsx';
import { DatePickerViewsGroup } from '../ViewsGroup/ViewsGroup.tsx';

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
    getPreviousViewDate,
    getNextViewDate,
} from '../../helpers.ts';
import { actions } from '../../reducer.ts';
import {
    DatePickerCellsContainerRef,
    DatePickerContainerProps,
    DatePickerContainerRef,
    DatePickerDisabledDateFilter,
    DatePickerHeaderProps,
    DatePickerItem,
    DatePickerRangePart,
    DatePickerSearchResults,
    DatePickerSliderRef,
    DatePickerState,
    DatePickerViewsGroupProps,
    DatePickerViewTransform,
    DatePickerZoomInParams,
    DatePickerZoomOutParams,
    DragZoneRef,
    DropTargetRef,
    GetViewHeightsParam,
    ViewHeights,
} from '../../types.ts';
import './DatePickerContainer.scss';

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

    const prevTargetViewRef = useRef<HTMLDivElement | null>(null);
    const targetViewRef = useRef<HTMLDivElement | null>(null);
    const secondTargetViewRef = useRef<HTMLDivElement | null>(null);
    const nextTargetViewRef = useRef<HTMLDivElement | null>(null);

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
    const { reference, referenceRef, elementRef } = usePopupPosition({
        ...(state?.position ?? {}),
        open: (state?.visible ?? false),
    });

    const onStateReady = () => {
        if (waitingForAnimationRef.current) {
            return;
        }

        dispatch(actions.finishNavigate());

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

        const isSlideNext = (!!st.nextState && st.date < st.nextState?.date);
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
                if (vertical) {
                    return;
                }

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
        onEntered: () => {
            const st = getState();
            const isVerticalSlide = isSlideTransition(st) && st.vertical;
            if (!isVerticalSlide) {
                return;
            }

            const navigateToPrev = (st.transition === 'slideToPrevious');
            if (navigateToPrev && !prevTargetViewRef.current) {
                return;
            }

            const prevRef = (navigateToPrev) ? prevTargetViewRef : currViewRef;

            let currRef = prevViewRef;
            if (!navigateToPrev) {
                currRef = (doubleView) ? secondViewRef : nextViewRef;
            }

            let secondRef = null;
            if (doubleView) {
                secondRef = (navigateToPrev) ? nextViewRef : currViewRef;
            }

            let nextRef = nextTargetViewRef;
            if (navigateToPrev) {
                nextRef = (doubleView) ? secondViewRef : currViewRef;
            }

            viewHeightsRef.current = getViewsHeights({
                prev: prevRef.current,
                current: currRef.current,
                second: secondRef?.current ?? null,
                next: nextRef?.current ?? null,
            });
            const height = getContainerHeight(viewHeightsRef.current);

            dispatch(actions.resize({ height }));
        },
        onExiting: () => {
            waitingForAnimationRef.current = false;
            setDefaultContentPosition();

            animation.setTransform(null);
            onStateReady();

            if (resizeRequestedRef.current) {
                onResize();
            }
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
        if (waitingForAnimationRef.current) {
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
        if (waitingForAnimationRef.current) {
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
        if (waitingForAnimationRef.current) {
            return;
        }

        dispatch(actions.clearSelection());
    };

    const setDisabledDateFilter = (disabledDateFilter: DatePickerDisabledDateFilter | null) => {
        if (waitingForAnimationRef.current) {
            return;
        }

        dispatch(actions.setDisabledDateFilter(disabledDateFilter));
    };

    const setRangePart = (rangePart: DatePickerRangePart | null) => {
        if (waitingForAnimationRef.current) {
            return;
        }

        dispatch(actions.setRangePart(rangePart));
    };

    /** Range select inner callback */
    const onRangeSelect = (date: Date) => {
        if (waitingForAnimationRef.current) {
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
        if (waitingForAnimationRef.current) {
            return;
        }

        dispatch(actions.selectDay(date));

        const newState = getState();
        const activeDates = asArray(newState.actDate);
        if (activeDates.length > 0) {
            const value = (newState.multiple)
                ? activeDates
                : activeDates[0];
            props.onDateSelect?.(value, newState);
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
            secondViewTransition = secondViewRef.current?.contains(elem) ?? false;
        }

        return {
            item,
            index,
            secondViewTransition,
        };
    };

    const onViewClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!currViewRef.current || waitingForAnimationRef.current) {
            return;
        }

        const target = e.target as HTMLElement;
        const { item, secondViewTransition } = findItemByElement(target);
        if (item) {
            handleItemSelect(item, { secondViewTransition });
        }
    };

    const setContentPosition = (position: number) => {
        if (!currViewRef.current || waitingForAnimationRef.current) {
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
        if (!currViewRef.current || waitingForAnimationRef.current) {
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
        if (!st.nextState) {
            return;
        }

        const { secondViewTransition } = st;
        const zoomingOut = st.transition === 'zoomOut';
        const cellView = ((zoomingOut) ? targetViewRef : currViewRef).current;
        const secondCellView = ((zoomingOut) ? secondTargetViewRef : secondViewRef).current;
        if (!cellView || (doubleView && !secondCellView)) {
            return;
        }

        const relViewType = (zoomingOut) ? st.viewType : st.nextState.viewType;
        const relViewDate = (zoomingOut) ? st.date : st.nextState.date;
        let relView;
        if (secondViewTransition) {
            relView = ((zoomingOut) ? secondViewRef : secondTargetViewRef).current;
        } else {
            relView = ((zoomingOut) ? currViewRef : targetViewRef).current;
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

        const view = {
            width: st.width,
            height: st.height,
        };

        if (secondViewTransition && zoomingOut) {
            if (vertical) {
                cell.y += (st.height / 2);
            } else {
                cell.x += (st.width / 2);
            }
        }

        const scaleX = cell.width / view.width;
        const scaleY = cell.height / view.height;
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

    // Update visibility of component
    useEffect(() => {
        show(props.visible);
    }, [props.visible]);

    // Handle size and position of DatePicker popup on open
    useEffect(() => {
        const st = getState();
        if (st.visible && (st.width === 0 || st.height === 0)) {
            onResize();
        }
    }, [state.visible, state.width, state.height]);

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
            const headerEl = current?.querySelector('.dp__header') as HTMLElement;
            res.header = getHeight(headerEl);
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
            return Math.max(...childHeights, 0);
        }

        // For vertical layout return sum of all views and gaps between
        const gapsHeight = (props.rowGap ?? 0) * (childHeights.length - 1);
        let res = childHeights.reduce((sum, item) => (sum + item), 0) + gapsHeight;

        if (doubleView && vertical) {
            res -= heights.header ?? 0;
        }

        return res;
    };

    function onResize() {
        if (!currViewRef.current || waitingForAnimationRef.current) {
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

        setDefaultContentPosition();

        dispatch(actions.resize({
            doubleView,
            width,
            height,
        }));
    }

    useEffect(() => {
        const containerEl = innerRef.current as HTMLElement;
        const refEl = reference.current as HTMLElement;
        if (!containerEl && !refEl) {
            return undefined;
        }

        const observer = new ResizeObserver(onResize);
        if (containerEl) {
            observer.observe(containerEl);
        }
        if (refEl) {
            observer.observe(refEl);
        }

        return () => {
            observer.disconnect();
        };
    }, [innerRef.current, reference.current]);

    // Measure dimensions of views
    useEffect(() => {
        viewHeightsRef.current = getViewsHeights();
        const width = getWidth(cellsContainerRef.current);
        const height = getContainerHeight(viewHeightsRef.current);

        dispatch(actions.resize({ width, height }));

        setDefaultContentPosition();
    }, [state.date, state.viewType]);

    /**
     * Mouse whell event handler
     * @param {Event} ev - wheel event object
     */
    const onWheel = (ev: Event) => {
        const e = ev as WheelEvent;
        if (waitingForAnimationRef.current) {
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

        isReady: () => !waitingForAnimationRef.current,

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
            !st.nextState
            || animation.stage !== AnimationStages.exited
            || waitingForAnimationRef.current
        ) {
            return;
        }

        if (isSlideTransition(st)) {
            const isNext = st.nextState.date > state.date;
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
        state.nextState,
        animation.stage,
        waitingForAnimationRef.current,
    ]);

    const isZoom = isZoomTransition(getState());

    // Render views
    const viewDates = getViewDates(getState());

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
            date: viewDates.second,
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
    const viewGroupProps: DatePickerViewsGroupProps = {
        ...state,
        focusable: keyboardNavigation,
        renderOutside: !isZoom,
        ...viewDates,
        zoomOut,
        onClickTitle: zoomOut,
        onClickPrev: navigateToPrev,
        onClickNext: navigateToNext,
        refs: {
            previous: prevViewRef,
            current: currViewRef,
            second: secondViewRef,
            next: nextViewRef,
        },
    };

    const views = <DatePickerViewsGroup {...viewGroupProps} />;

    const cellsContainerProps: StyledHTMLAttributes = {
        className: classNames(
            'dp__view',
            {
                'dp__animated-view': state.animated && (isEntering || isEntered),
            },
        ),
        style: {},
    };

    const sliderProps: StyledHTMLAttributes = {
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
            viewHeightsRef.current = getViewsHeights();
            const height = getContainerHeight(viewHeightsRef.current);

            dispatch(actions.resize({ height }));

            if (state.width > 0) {
                setDefaultContentPosition();
            }
        }
    }, [currViewRef.current, rebuildContentRef.current, props.animated]);

    if (
        !currViewRef.current
        || rebuildContentRef.current
        || !props.animated
    ) {
        sliderProps.style.transform = '';
        cellsContainerProps.style.width = '';

        rebuildContentRef.current = false;
    }

    if (state.width > 0) {
        cellsContainerProps.style.width = px(state.width);
    }
    if (state.height > 0) {
        cellsContainerProps.style.height = px(state.height);
    }

    if (vertical) {
        sliderProps.style.top = px(state.sliderPosition);
    } else {
        sliderProps.style.left = px(state.sliderPosition);
    }

    let viewContent;

    const transform = animation.transform?.transform ?? '';
    if (isZoom) {
        const zoomingOut = state.transition === 'zoomOut';

        const sourceProps: StyledHTMLAttributes = {
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
        const targetProps: StyledHTMLAttributes = {
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

        const nextViewsProps = {
            ...state,
            date: state.nextState?.date ?? state.date,
            viewType: state.nextState?.viewType ?? state.viewType,
            focusable: keyboardNavigation,
            renderOutside: false,
            ...viewDates,
            zoomOut,
            onClickTitle: zoomOut,
            onClickPrev: navigateToPrev,
            onClickNext: navigateToNext,
            refs: {
                current: targetViewRef,
                second: secondTargetViewRef,
            },
        };

        viewContent = (
            <>
                <div {...targetProps} ref={zoomTargetRef}>
                    <DatePickerViewsGroup {...nextViewsProps} />
                </div>
                <div {...sourceProps} ref={zoomSourceRef}>
                    {views}
                </div>
            </>
        );
    } else {
        sliderProps.style.transform = (isEntered || isExiting) ? transform : '';

        let measureView = null;
        const toPrev = (state.transition === 'slideToPrevious');
        const toNext = (state.transition === 'slideToNext');

        if (toPrev || toNext) {
            const nextState = {
                ...state,
                ...state.nextState,
            };

            const dateToMeasure = (toPrev)
                ? getPreviousViewDate(nextState)
                : getNextViewDate(nextState);

            measureView = (
                <DatePickerDateView
                    {...{
                        ...viewGroupProps,
                        date: dateToMeasure,
                        dateViewRef: (toPrev) ? prevTargetViewRef : nextTargetViewRef,
                    }}
                />
            );
        } else {
            prevTargetViewRef.current = null;
            nextTargetViewRef.current = null;
        }

        viewContent = (
            <div {...sliderProps} ref={sliderRef} >
                {views}
                {measureView}
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

    const refWrapperProps = {
        className: 'dp__ref-wrapper',
    };

    return (
        <>
            <div {...refWrapperProps} ref={referenceRef}>
                {props.children}
            </div>
            {state.visible && !state.fixed && datePicker}
            {state.visible && state.fixed && (
                createPortal(datePicker, container)
            )}
        </>
    );
});

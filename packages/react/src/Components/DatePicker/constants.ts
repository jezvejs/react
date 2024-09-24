export const TRANSITION_END_TIMEOUT = 500;
export const SWIPE_THRESHOLD = 0.1;
export const MIN_DOUBLE_VIEW_SCREEN_WIDTH = 724;

export const MONTH_VIEW = 'month';
export const YEAR_VIEW = 'year';
export const YEARRANGE_VIEW = 'yearrange';

export const YEAR_RANGE_LENGTH = 10;

export const viewTypesMap = {
    date: MONTH_VIEW,
    month: YEAR_VIEW,
    year: YEARRANGE_VIEW,
};

export const slideTransitions = ['slideToPrevious', 'slideToNext'];
export const zoomTransitions = ['zoomIn', 'zoomOut'];

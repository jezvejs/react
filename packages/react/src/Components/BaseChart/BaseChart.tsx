import { asArray } from '@jezvejs/types';
import { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import { StoreProvider } from '../../utils/Store/StoreProvider.tsx';
import { combineReducers } from '../../utils/combineReducers.ts';

import { BaseChartContainer } from './BaseChartContainer.tsx';

import { defaultProps } from './defaultProps.ts';
import { getInitialState } from './helpers.ts';
import * as BaseChartHelpers from './helpers.ts';
import { reducer } from './reducer.ts';
import './BaseChart.scss';

export {
    BaseChartHelpers,
};

/**
 * BaseChart component
 */
// eslint-disable-next-line react/display-name
export const BaseChart = forwardRef((props, ref) => {
    const reducers = useMemo(() => {
        const extraReducers = asArray(props.reducers);
        return (extraReducers.length > 0)
            ? combineReducers(reducer, ...extraReducers)
            : reducer;
    }, [props.reducers]);

    const initialState = getInitialState(props, defaultProps);

    return (
        <StoreProvider
            reducer={reducers}
            initialState={initialState}
        >
            <BaseChartContainer ref={ref} {...initialState} />
        </StoreProvider>
    );
});

BaseChart.propTypes = {
    ...BaseChartContainer.propTypes,
    reducers: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
    ]),
};

BaseChart.childComponents = {
    ...BaseChartContainer.childComponents,
};

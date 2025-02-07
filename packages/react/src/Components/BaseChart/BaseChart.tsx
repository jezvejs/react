import { asArray } from '@jezvejs/types';
import { forwardRef, useMemo } from 'react';

import { StoreProvider } from '../../utils/Store/StoreProvider.tsx';
import { combineReducers } from '../../utils/combineReducers.ts';

import { BaseChartContainer } from './BaseChartContainer.tsx';

import { defaultProps } from './defaultProps.ts';
import { getInitialState } from './helpers.ts';
import * as BaseChartHelpers from './helpers.ts';
import { reducer } from './reducer.ts';
import { BaseChartProps } from './types.ts';
import './BaseChart.scss';

export * from './types.ts';
export {
    BaseChartHelpers,
};

export type BaseChartRef = HTMLDivElement | null;

/**
 * BaseChart component
 */
export const BaseChart = forwardRef<
    BaseChartRef,
    Partial<BaseChartProps>
>((props, ref) => {
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

BaseChart.displayName = 'BaseChart';

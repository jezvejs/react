import { asArray } from '@jezvejs/types';
import { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import { StoreProvider } from '../../utils/Store/StoreProvider.jsx';
import { combineReducers } from '../../utils/combineReducers.js';

import { BaseChartContainer } from './BaseChartContainer.jsx';

import { defaultProps } from './defaultProps.js';
import { getInitialState } from './helpers.js';
import * as BaseChartHelpers from './helpers.js';
import { reducer } from './reducer.js';
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

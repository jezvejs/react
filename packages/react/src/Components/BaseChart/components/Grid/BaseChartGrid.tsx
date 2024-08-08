import PropTypes from 'prop-types';

import { BaseChartXAxisGrid } from './BaseChartXAxisGrid.tsx';
import { BaseChartYAxisGrid } from './BaseChartYAxisGrid.tsx';

import './BaseChartGrid.scss';

/**
 * BaseChartGrid component
 */
export const BaseChartGrid = (props) => {
    const gridProps = {
        grid: null,
        yAxisGrid: true,
        xAxisGrid: false,
        getGroupOuterWidth: null,
        getFirstVisibleGroupIndex: null,
        getVisibleGroupsCount: null,
        ...props,
    };

    const XAxisGrid = BaseChartXAxisGrid;
    const YAxisGrid = BaseChartYAxisGrid;

    return (
        <g>
            <XAxisGrid {...gridProps} />
            <YAxisGrid {...gridProps} />
        </g>
    );
};

BaseChartGrid.propTypes = {
    grid: PropTypes.object,
    yAxisGrid: PropTypes.bool,
    xAxisGrid: PropTypes.bool,
    chartWidth: PropTypes.number,
    height: PropTypes.number,
    getGroupOuterWidth: PropTypes.func,
    getFirstVisibleGroupIndex: PropTypes.func,
    getVisibleGroupsCount: PropTypes.func,
};

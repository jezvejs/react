import { isFunction } from '@jezvejs/types';
import { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { getComponent } from './helpers.ts';

/**
 * BaseChartPopupContainer component
 */
// eslint-disable-next-line react/display-name
export const BaseChartPopupContainer = forwardRef((props, ref) => {
    const defaultPopupContent = (target, state) => {
        if (!target) {
            return null;
        }

        const ChartPopup = getComponent('ChartPopup', state);

        return (
            <ChartPopup
                {...state}
                target={target}
            />
        );
    };

    const renderPopupContent = (target, state) => {
        if (isFunction(state.renderPopup)) {
            return state.renderPopup(target, state);
        }

        return defaultPopupContent(target, state);
    };

    const isPinnedTarget = !!props.pinnedTarget && props.target === props.pinnedTarget;

    const item = props.findItemByTarget(props.target, props);
    if (!item) {
        return null;
    }

    const content = renderPopupContent(props.target, props);
    if (!item) {
        return null;
    }

    return (
        <div
            className={classNames(
                'chart__popup',
                {
                    chart__popup_pinned: isPinnedTarget,
                    chart__popup_animated: props.animatePopup,
                },
            )}
            ref={ref}
        >
            {content}
        </div>
    );
});

BaseChartPopupContainer.propTypes = {
    target: PropTypes.object,
    pinnedTarget: PropTypes.object,
    animatePopup: PropTypes.bool,
    findItemByTarget: PropTypes.func,
};

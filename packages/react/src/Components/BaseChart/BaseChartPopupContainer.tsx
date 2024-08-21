import { forwardRef } from 'react';
import classNames from 'classnames';
import {
    BaseChartPopupContainerComponent,
    BaseChartPopupContainerProps,
    BaseChartPopupContainerRef,
    BaseChartState,
    BaseChartTarget,
} from './types.ts';

/**
 * BaseChartPopupContainer component
 */
// eslint-disable-next-line react/display-name
export const BaseChartPopupContainer: BaseChartPopupContainerComponent = forwardRef<
    BaseChartPopupContainerRef,
    BaseChartPopupContainerProps
>((props, ref) => {
    const defaultPopupContent = (target: BaseChartTarget, state: BaseChartState) => {
        if (!target) {
            return null;
        }

        const { ChartPopup } = state.components;

        return ChartPopup && (
            <ChartPopup
                {...state}
                target={target}
            />
        );
    };

    const renderPopupContent = (target: BaseChartTarget, state: BaseChartState) => {
        if (typeof state.renderPopup === 'function') {
            return state.renderPopup(target, state);
        }

        return defaultPopupContent(target, state);
    };

    const currentTarget = props.target ?? null;
    if (!currentTarget) {
        return null;
    }

    const isPinnedTarget = !!props.pinnedTarget && currentTarget === props.pinnedTarget;

    const item = props.findItemByTarget(currentTarget, props);
    if (!item) {
        return null;
    }

    const content = renderPopupContent(currentTarget, props);
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

import { forwardRef } from 'react';
import classNames from 'classnames';
import { BaseChartState, BaseChartTarget } from './types.ts';
import { getComponent } from './helpers.ts';

type BaseChartPopupContainerRef = HTMLDivElement | null;

export interface BaseChartPopupContainerProps extends BaseChartState {
    target?: BaseChartTarget,
}

/**
 * BaseChartPopupContainer component
 */
// eslint-disable-next-line react/display-name
export const BaseChartPopupContainer = forwardRef<
    BaseChartPopupContainerRef,
    BaseChartPopupContainerProps
>((props, ref) => {
    const defaultPopupContent = (target: object, state: object) => {
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

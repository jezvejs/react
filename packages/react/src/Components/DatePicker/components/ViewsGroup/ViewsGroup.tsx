import { useMemo } from 'react';
import { DatePickerViewsGroupProps } from '../../types.ts';
import { DatePickerDateView } from '../DateView/DateView.tsx';

export const DatePickerViewsGroup = (props: DatePickerViewsGroupProps) => {
    const {
        renderOutside = true,
        refs,
        doubleView,
    } = props;

    const res = useMemo(() => {
        const prevView = renderOutside && (
            <DatePickerDateView
                {...{
                    ...props,
                    date: props.previous,
                    dateViewRef: refs?.previous,
                }}
            />
        );
        const currentView = (
            <DatePickerDateView
                {...{
                    ...props,
                    date: props.current,
                    dateViewRef: refs?.current,
                }}
            />
        );

        const secondView = props.doubleView && (
            <DatePickerDateView
                {...{
                    ...props,
                    date: props.second,
                    dateViewRef: refs?.second,
                }}
            />
        );

        const nextView = renderOutside && (
            <DatePickerDateView
                {...{
                    ...props,
                    date: props.next,
                    dateViewRef: refs?.next,
                }}
            />
        );

        return (
            <>
                {prevView}
                {currentView}
                {doubleView && secondView}
                {nextView}
            </>
        );
    }, [
        props.date,
        props.doubleView,
        props.viewType,
        props.locales,
        props.slideIndex,
        props.previous,
        props.current,
        props.second,
        props.next,
        renderOutside,
    ]);

    return res;
};

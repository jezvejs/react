import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { afterTransition } from '@jezvejs/dom';

import { useDragnDrop } from '../../../../utils/DragnDrop/DragnDropProvider.jsx';

import { AnimationStages, mapTreeItems } from '../../helpers.js';

// eslint-disable-next-line react/display-name
export const SortableListItem = forwardRef((props, ref) => {
    const { placeholderClass, animatedClass } = props;

    const { setState, getState } = useDragnDrop();

    const innerRef = useRef(0);
    useImperativeHandle(ref, () => innerRef.current);

    const removeTransitionHandlerRef = useRef(0);

    const onAnimationDone = () => {
        const { zoneId } = props;

        setState((prev) => ({
            ...prev,
            [zoneId]: {
                ...prev[zoneId],
                items: mapTreeItems(prev[zoneId].items, (item) => {
                    if (item.id !== props.id) {
                        return item;
                    }

                    return {
                        ...item,
                        animationStage: AnimationStages.exiting,
                    };
                }),
            },
        }));
    };

    useEffect(() => {
        if (innerRef.current) {
            removeTransitionHandlerRef.current = afterTransition(
                innerRef.current.parentNode,
                {
                    elem: innerRef.current,
                    duration: props.transitionTimeout,
                    property: 'transform',
                },
                () => onAnimationDone(),
            );
        }

        return () => {
            removeTransitionHandlerRef.current?.();
            removeTransitionHandlerRef.current = null;
        };
    }, [props.animationStage]);

    const state = getState();
    const isPlaceholder = (
        props.placeholder
        || (
            state.dragging
            && props.id === state.itemId
        )
    );

    const isAnimationEntering = props.animationStage === AnimationStages.entering;
    const isAnimationEntered = props.animationStage === AnimationStages.entered;

    const listItemProps = {
        ...props,
        className: classNames(
            props.className,
            {
                [placeholderClass]: isPlaceholder,
                [animatedClass]: (!!props.animated && isAnimationEntered),
            },
        ),
        style: {},
    };

    listItemProps.style.transitionProperty = (isAnimationEntering || isAnimationEntered)
        ? 'transform'
        : '';

    listItemProps.style.transform = (props.transformMatrix && isAnimationEntering)
        ? `matrix(${props.transformMatrix.join()})`
        : '';

    const { ListItem } = props.components;

    return (
        <ListItem {...listItemProps} ref={innerRef} />
    );
});

const isComponent = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
]);

SortableListItem.propTypes = {
    id: PropTypes.string,
    zoneId: PropTypes.string,
    group: PropTypes.string,
    className: PropTypes.string,
    placeholderClass: PropTypes.string,
    animatedClass: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    animated: PropTypes.bool,
    animationStage: PropTypes.number,
    transitionTimeout: PropTypes.number,
    transformMatrix: PropTypes.array,
    style: PropTypes.object,
    components: PropTypes.shape({
        ListItem: isComponent,
    }),
};

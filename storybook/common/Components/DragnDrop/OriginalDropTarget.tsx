import {
    DragMaster,
    DragnDropState,
    DropTarget,
    OnDragEndParams,
    useDragnDrop,
    useDropTarget,
} from '@jezvejs/react';
import { BoxProps } from './Box.tsx';

export type OriginalDropTargetProps = Omit<DropTarget, 'id'> & {
    id?: string;
    items?: BoxProps[];
    dragOriginal?: boolean;

    children?: React.ReactNode;

    onDragEnd?: (param: OnDragEndParams) => void;
};

export type OriginalDragnDropState = DragnDropState & {
    [key: string]: DragnDropState;
};

export const OriginalDropTarget = (props: OriginalDropTargetProps) => {
    const { setState } = useDragnDrop();

    const { dropTargetRef } = useDropTarget<HTMLDivElement>({
        ...props,

        id: props.id ?? '',

        onDragEnd(params: OnDragEndParams) {
            const { avatarInfo, offset, border } = params;
            const { id } = avatarInfo ?? {};
            if (!avatarInfo || !id || !offset || !border) {
                return;
            }

            const page = DragMaster.getEventPageCoordinates(params.e as TouchEvent | MouseEvent);
            const left = page.x - avatarInfo.mouseShift.x - offset.left - border.left;
            const top = page.y - avatarInfo.mouseShift.y - offset.top - border.top;

            setState((prev: OriginalDragnDropState) => ({
                ...prev,
                [id]: {
                    ...(prev[id] ?? {}),
                    left,
                    top,
                    origLeft: left,
                    origTop: top,
                    dragging: false,
                },
                left,
                top,
                origLeft: left,
                origTop: top,
                dragging: false,
                draggingId: null,
            }));
        },
    });

    return (
        <div ref={dropTargetRef} className="section-h200 drag-area">
            {props.children}
        </div>
    );
};

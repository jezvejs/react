import { DropDown, DropDownProps } from '@jezvejs/react';
import { usePortalElement } from '../../../../../common/hooks/usePortalElement.tsx';
import { BlueBox } from '../BlueBox/BlueBox.tsx';

export interface AttachedToBlockProps extends DropDownProps {
    boxId: string;
}

export const AttachedToBlock: React.FC<AttachedToBlockProps> = ({
    boxId = 'box',
    ...props
}) => {
    const portalElement = usePortalElement();

    return (
        <DropDown {...props} container={portalElement}>
            <BlueBox id={boxId} />
        </DropDown>
    );
};

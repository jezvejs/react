import PropTypes from 'prop-types';
import { DropDown } from '@jezvejs/react';
import { BlueBox } from '../BlueBox/BlueBox.jsx';
import { usePortalElement } from '../../../../../hooks/usePortalElement.jsx';

export const AttachedToBlock = ({
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

AttachedToBlock.propTypes = {
    ...DropDown.propTypes,
    boxId: PropTypes.string,
};

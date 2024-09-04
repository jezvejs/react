import PropTypes from 'prop-types';
import { DropDown } from '@jezvejs/react';
import { usePortalElement } from '../../../../../common/hooks/usePortalElement.jsx';
import { BlueBox } from '../BlueBox/BlueBox.jsx';

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

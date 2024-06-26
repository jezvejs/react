import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { DropDown } from '@jezvejs/react';
import { BlueBox } from '../BlueBox/BlueBox.jsx';

export const AttachedToBlock = ({
    boxId = 'box',
    ...props
}) => {
    const portalElement = useMemo(() => (
        document.getElementById('custom-root')
    ), []);

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

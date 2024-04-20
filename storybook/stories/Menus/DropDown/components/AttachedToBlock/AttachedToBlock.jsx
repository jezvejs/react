import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { DropDown } from '@jezvejs/react';
import { BlueBox } from '../BlueBox/BlueBox.jsx';

export const AttachedToBlock = ({ boxId, ...args }) => {
    const portalElement = useMemo(() => (
        document.getElementById('custom-root')
    ), []);

    return (
        <DropDown {...args} container={portalElement}>
            <BlueBox id={boxId} />
        </DropDown>
    );
};

AttachedToBlock.propTypes = {
    ...DropDown.propTypes,
    boxId: PropTypes.string,
};

AttachedToBlock.defaultProps = {
    ...DropDown.defaultProps,
    boxId: 'box',
};

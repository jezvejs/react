import { CloseButton } from '@jezvejs/react';
import './BlueBox.scss';

export const BlueBox = (props) => (
    <div {...props} className='bluebox'>
        <span className='box__title'>click</span>
        <CloseButton tabIndex={-1} />
    </div>
);

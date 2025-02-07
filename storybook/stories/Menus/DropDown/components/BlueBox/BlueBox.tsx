import { CloseButton } from '@jezvejs/react';
import './BlueBox.scss';

export type BlueBoxProps = React.HTMLAttributes<HTMLDivElement>;

export const BlueBox: React.FC<BlueBoxProps> = (props) => (
    <div {...props} className='bluebox'>
        <span className='box__title'>click</span>
        <CloseButton tabIndex={-1} />
    </div>
);

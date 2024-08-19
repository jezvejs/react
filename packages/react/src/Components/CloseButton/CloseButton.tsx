import classNames from 'classnames';

import { Button, ButtonProps } from '../Button/Button.tsx';

import CloseIcon from './assets/close.svg';
import SmallCloseIcon from './assets/close-sm.svg';

import './CloseButton.scss';

export interface CloseButtonProps extends Partial<ButtonProps> {
    small?: boolean,
}

/**
 * CloseButton component
 */
export const CloseButton = ({ small = true, ...props }: CloseButtonProps) => (
    <Button
        {...props}
        className={classNames('close-btn', props.className)}
        icon={(small) ? SmallCloseIcon : CloseIcon}
    />
);

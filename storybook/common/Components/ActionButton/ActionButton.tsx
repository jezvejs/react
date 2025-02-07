import classNames from 'classnames';
import { Button, ButtonProps } from '@jezvejs/react';
import './ActionButton.scss';

export const ActionButton: React.FC<ButtonProps> = (props) => (
    <Button
        {...props}
        className={classNames('action-btn', props.className)}
    />
);

import classNames from 'classnames';
import { Button, ButtonProps } from '../../../Button/Button.tsx';
import './InputGroupInnerButton.scss';

export type InputGroupInnerButtonProps = ButtonProps;

export const InputGroupInnerButton = (props: InputGroupInnerButtonProps) => (
    <Button
        {...props}
        className={classNames('input-group__inner-btn', props.className)}
    />
);

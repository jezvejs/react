import classNames from 'classnames';
import { Input, InputProps } from '../../../Input/Input.tsx';
import './InputGroupInput.scss';

export type InputGroupInputProps = InputProps;

export const InputGroupInput = (props: InputGroupInputProps) => (
    <Input
        {...props}
        className={classNames('input-group__input', props.className)}
    />
);

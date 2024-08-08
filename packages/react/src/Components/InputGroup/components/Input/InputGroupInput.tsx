import classNames from 'classnames';
import { Input } from '../../../Input/Input.tsx';
import './InputGroupInput.scss';

export const InputGroupInput = (props) => (
    <Input
        {...props}
        className={classNames('input-group__input', props.className)}
    />
);

InputGroupInput.propTypes = {
    ...Input.propTypes,
};

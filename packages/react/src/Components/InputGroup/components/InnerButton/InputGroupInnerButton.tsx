import classNames from 'classnames';
import { Button } from '../../../Button/Button.tsx';
import './InputGroupInnerButton.scss';

export const InputGroupInnerButton = (props) => (
    <Button
        {...props}
        className={classNames('input-group__inner-btn', props.className)}
    />
);

InputGroupInnerButton.propTypes = {
    ...Button.propTypes,
};

import classNames from 'classnames';
import { Button } from '@jezvejs/react';
import './ActionButton.scss';

export const ActionButton = (props) => (
    <Button
        {...props}
        className={classNames('action-btn', props.className)}
    />
);

ActionButton.propTypes = {
    ...Button.propTypes,
};

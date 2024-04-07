import { Button } from '@jezvejs/react';
import './ActionButton.scss';

export const ActionButton = (props) => (
    <Button className='action-btn' {...props} />
);

ActionButton.propTypes = {
    ...Button.propTypes,
};

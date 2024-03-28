import { ActionButton } from './ActionButton.jsx';

export const CancelBtn = ({ title = 'cancel', ...props }) => (
    <ActionButton title={title} {...props} />
);

CancelBtn.propTypes = {
    ...ActionButton.propTypes,
};

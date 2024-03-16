import { ActionButton } from './ActionButton.jsx';

export const OkBtn = ({ title = 'ok', ...props }) => (
    <ActionButton title={title} {...props} />
);

OkBtn.propTypes = {
    ...ActionButton.propTypes,
};

import { ButtonProps } from '@jezvejs/react';
import { ActionButton } from './ActionButton.tsx';

export const CancelBtn: React.FC<ButtonProps> = ({ title = 'cancel', ...props }) => (
    <ActionButton title={title} {...props} />
);

import { ButtonProps } from '@jezvejs/react';
import { ActionButton } from './ActionButton.tsx';

export const OkBtn: React.FC<ButtonProps> = ({ title = 'ok', ...props }) => (
    <ActionButton title={title} {...props} />
);

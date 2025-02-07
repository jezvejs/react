import { MenuPlaceholderComponent } from '@jezvejs/react';
import './LoadingPlaceholder.scss';

export const LoadingPlaceholder: MenuPlaceholderComponent = ({
    title = 'Loading...',
}) => (
    <div className='loading-placeholder'>{title}</div>
);

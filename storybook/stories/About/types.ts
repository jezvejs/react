import { ReactNode } from 'react';

export interface CommonProps {
    children?: ReactNode;
}

export interface ComponentCardProps extends CommonProps {
    className?: string;
    title?: string;
    url?: string;
    description?: string;
    vertical?: boolean;
}

import { ReactNode } from 'react';

export interface TabListItemProps {
    id: string,
    type?: string,
    className?: string,
    title?: string,
    icon?: ReactNode,
    content?: ReactNode,
}

export interface TabListProps {
    id?: string,
    className?: string,
    selectedId?: string | null,
    items?: TabListItemProps[],
}

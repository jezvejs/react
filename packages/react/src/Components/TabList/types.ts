import { MenuItemType } from '../Menu/types.ts';

export interface TabListItemProps {
    id: string,
    type?: MenuItemType,
    className?: string,
    title?: string,
    icon?: React.ComponentType,
    content?: React.ReactNode,
}

export interface TabListProps {
    id?: string,
    className?: string,
    selectedId?: string | null,
    items?: TabListItemProps[],
}

export interface PaginatorItemProps {
    ellipsis?: boolean;
    active?: boolean;
    allowActiveLink?: boolean;
    page?: number;
    url?: string;
    pageParam?: string;
    navigation?: string;
}

export interface PaginatorCommonItemProps {
    allowActiveLink?: boolean;
    pageParam?: string;
    url?: string;
}

export interface PaginatorArrowProps {
    navigation?: string,
    page?: number,
}

export interface PaginatorItemAttr {
    className: string;
    'data-page'?: string;
    disabled?: boolean;
    href?: string;
}

export interface PaginatorProps {
    id: string;
    className: string;
    breakLimit: number;
    groupLimit: number;
    pageNum: number;
    pagesCount: number;
    allowActiveLink: boolean;
    showSingleItem: boolean;
    arrows: boolean;
    pageParam: string;
    url?: string;
    onChange: (page: number) => void;
}

export type PaginatorState = PaginatorProps;

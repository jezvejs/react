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

export type PaginatorOnChangeHandler = (page: number) => void;

export interface PaginatorProps {
    id?: string;
    className?: string;
    breakLimit?: number;
    groupLimit?: number;
    pageNum?: number;
    pagesCount?: number;
    allowActiveLink?: boolean;
    showSingleItem?: boolean;
    arrows?: boolean;
    pageParam?: string;
    url?: string;
    onChange?: PaginatorOnChangeHandler | null;
}

type PaginatorStateProps =
    | 'breakLimit'
    | 'groupLimit'
    | 'pageNum'
    | 'pagesCount'
    | 'allowActiveLink'
    | 'arrows'
    | 'pageParam'
    | 'url'
    | 'onChange'
    | 'showSingleItem';

export type PaginatorRequiredProps = Required<Pick<PaginatorProps, PaginatorStateProps>>;

type PaginatorStateBase = Omit<PaginatorProps, PaginatorStateProps> & PaginatorRequiredProps;

export interface PaginatorState extends PaginatorStateBase {
    pagesCount: number;
}

import { isFunction } from '@jezvejs/types';
import { useState } from 'react';
import classNames from 'classnames';

import { PaginatorItem } from './components/Item/PaginatorItem.tsx';

import { getItems } from './helpers.ts';
import { PaginatorProps, PaginatorState } from './types.ts';
import './Paginator.scss';

const defaultProps = {
    id: undefined,
    breakLimit: 5,
    groupLimit: 3,
    pageNum: 1,
    pagesCount: 0,
    allowActiveLink: false,
    showSingleItem: false,
    arrows: false,
    pageParam: 'page',
    url: window.location.href,
    onChange: null,
};

export const Paginator = (p: PaginatorProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const [state, setState] = useState<PaginatorState>(props);
    const items = getItems(state);

    const setPage = (pageNum: number) => {
        if (
            (state.pageNum === pageNum)
            || (pageNum < 1)
            || (pageNum > state.pagesCount)
        ) {
            return;
        }

        setState((prev) => ({ ...prev, pageNum }));
    };

    const onChangePage = (e) => {
        if (!isFunction(props.onChange)) {
            return;
        }

        e.preventDefault();

        const itemTarget = e.target.closest('.paginator-item');
        if (!itemTarget || !itemTarget.dataset.page) {
            return;
        }

        const page = parseInt(itemTarget.dataset.page, 10);
        if (Number.isNaN(page)) {
            return;
        }

        props.onChange?.(page);

        setPage(page);
    };

    return (
        <div
            className={classNames('paginator', props.className)}
            onClick={onChangePage}
        >
            {items.map((item, index) => (
                <PaginatorItem key={`pg_${index}`} {...item} />
            ))}
        </div>
    );
};

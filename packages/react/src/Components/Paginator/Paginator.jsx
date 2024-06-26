import { isFunction } from '@jezvejs/types';
import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { PaginatorItem } from './components/Item/PaginatorItem.jsx';

import { getItems } from './helpers.js';
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

export const Paginator = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const [state, setState] = useState(props);
    const items = getItems(state);

    const setPage = (pageNum) => {
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

Paginator.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    breakLimit: PropTypes.number,
    groupLimit: PropTypes.number,
    pageNum: PropTypes.number,
    pagesCount: PropTypes.number,
    allowActiveLink: PropTypes.bool,
    showSingleItem: PropTypes.bool,
    arrows: PropTypes.bool,
    pageParam: PropTypes.string,
    url: PropTypes.string,
    onChange: PropTypes.func,
};

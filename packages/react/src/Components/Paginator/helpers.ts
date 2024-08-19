import {
    PaginatorCommonItemProps,
    PaginatorItemProps,
    PaginatorState,
} from './types.ts';

const getCommonProps = (state: PaginatorState): PaginatorCommonItemProps => ({
    allowActiveLink: state.allowActiveLink,
    pageParam: state.pageParam,
    url: state.url,
});

export const getPageItems = (state: PaginatorState): PaginatorItemProps[] => {
    const res: PaginatorItemProps[] = [];
    const commonProps = getCommonProps(state);

    // 1 2 3 4 5
    if (state.pagesCount <= state.breakLimit + 1) {
        for (let i = 1; i <= state.pagesCount; i += 1) {
            res.push({ page: i, active: (i === state.pageNum), ...commonProps });
        }

        return res;
    }

    //  1 2 3 4 5 ... 18
    if (state.pageNum < state.breakLimit) {
        for (let i = 1; i <= state.breakLimit; i += 1) {
            res.push({ page: i, active: (i === state.pageNum), ...commonProps });
        }
        res.push({ ellipsis: true, ...commonProps });
        res.push({ page: state.pagesCount, active: false, ...commonProps });

        return res;
    }

    //  1 ... 13 14 15 ... 18
    if (state.pageNum <= state.pagesCount - state.breakLimit + 1) {
        res.push({ page: 1, active: false, ...commonProps });
        res.push({ ellipsis: true, ...commonProps });
        for (
            let i = state.pageNum - (state.groupLimit - 2);
            i <= state.pageNum + (state.groupLimit - 2);
            i += 1
        ) {
            res.push({ page: i, active: (i === state.pageNum), ...commonProps });
        }
        res.push({ ellipsis: true, ...commonProps });
        res.push({ page: state.pagesCount, active: false, ...commonProps });

        return res;
    }

    //  1 ... 14 15 16 17 18
    res.push({ page: 1, active: false, ...commonProps });
    res.push({ ellipsis: true, ...commonProps });
    for (let i = state.pagesCount - state.breakLimit + 1; i <= state.pagesCount; i += 1) {
        res.push({ page: i, active: (i === state.pageNum), ...commonProps });
    }

    return res;
};

export const getItems = (state: PaginatorState): PaginatorItemProps[] => {
    const res: PaginatorItemProps[] = [];
    const commonProps = getCommonProps(state);

    if (!state.showSingleItem && state.pagesCount < 2) {
        return res;
    }

    // Previous page arrow
    if (state.arrows) {
        const navItem: PaginatorItemProps = {
            ...commonProps,
            navigation: 'prev',
        };
        if (state.pageNum > 1) {
            navItem.page = state.pageNum - 1;
        }
        res.push(navItem);
    }

    const pageItems = getPageItems(state);
    res.push(...pageItems);

    // Next page arrow
    if (state.arrows) {
        const navItem: PaginatorItemProps = {
            ...commonProps,
            navigation: 'next',
        };
        if (state.pageNum < state.pagesCount) {
            navItem.page = state.pageNum + 1;
        }
        res.push(navItem);
    }

    return res;
};

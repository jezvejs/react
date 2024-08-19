import classNames from 'classnames';
import { PaginatorArrow } from '../Arrow/PaginatorArrow.tsx';
import { PaginatorItemAttr, PaginatorItemProps } from '../../types.ts';

const defaultProps = {
    ellipsis: false,
    active: false,
    allowActiveLink: false,
};

export const PaginatorItem = (p: PaginatorItemProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    if (props.ellipsis) {
        return <span className='paginator-item'>...</span>;
    }

    if (props.active && !props.allowActiveLink) {
        return (
            <span className='paginator-item paginator-item__active'>{props.page}</span>
        );
    }

    const commonProps: PaginatorItemAttr = {
        className: classNames(
            'paginator-item',
            { 'paginator-item__active': !!props.active },
        ),
    };

    if (props.page) {
        commonProps['data-page'] = props.page.toString();
    } else {
        commonProps.disabled = true;
    }

    if (props.url) {
        const url = new URL(props.url);
        if (props.pageParam) {
            url.searchParams.set(props.pageParam, props.page?.toString() ?? '');
        }
        commonProps.href = url.toString();
    }

    if (props.navigation) {
        return <PaginatorArrow {...props}{...commonProps} />;
    }

    return (
        <a {...commonProps}>{props.page}</a>
    );
};

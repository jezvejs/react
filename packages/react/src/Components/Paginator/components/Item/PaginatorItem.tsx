import classNames from 'classnames';
import PropTypes from 'prop-types';

import { PaginatorArrow } from '../Arrow/PaginatorArrow.tsx';

const defaultProps = {
    ellipsis: false,
    active: false,
    allowActiveLink: false,
};

export const PaginatorItem = (p) => {
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

    const commonProps = {
        className: classNames(
            'paginator-item',
            { 'paginator-item__active': !!props.active },
        ),
    };

    if (props.page) {
        commonProps['data-page'] = props.page;
    } else {
        commonProps.disabled = true;
    }

    if (props.url) {
        const url = new URL(props.url);
        url.searchParams.set(props.pageParam, props.page);
        commonProps.href = url;
    }

    if (props.navigation) {
        return <PaginatorArrow {...props}{...commonProps} />;
    }

    return (
        <a {...commonProps}>{props.page}</a>
    );
};

PaginatorItem.propTypes = {
    ellipsis: PropTypes.bool,
    active: PropTypes.bool,
    allowActiveLink: PropTypes.bool,
    page: PropTypes.number,
    url: PropTypes.string,
    pageParam: PropTypes.string,
    navigation: PropTypes.string,
};

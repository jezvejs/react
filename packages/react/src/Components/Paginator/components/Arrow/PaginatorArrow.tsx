import classNames from 'classnames';
import { PaginatorArrowProps } from '../../types.ts';

const defaultArrowIcon = () => (
    <svg className='paginator-arrow__icon' viewBox='0 0 2.1 3.4'>
        <path
            d="m2 0.47-0.35-0.35-1.6 1.6 1.6 1.6 0.35-0.35-1.2-1.2z"
        />
    </svg>
);

const defaultProps = {
};

export const PaginatorArrow = (p: PaginatorArrowProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const Icon = defaultArrowIcon;

    const commonProps = {
        'data-page': props.page,
    };
    const isNext = props.navigation === 'next';

    return (
        <a
            className={classNames(
                'paginator-item',
                'paginator-arrow',
                (isNext) ? 'paginator-arrow__next' : 'paginator-arrow__prev',
            )}
            {...commonProps}
        >
            <Icon />
        </a>
    );
};

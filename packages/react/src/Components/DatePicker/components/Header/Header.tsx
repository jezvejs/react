import classNames from 'classnames';
import { DatePickerHeaderProps } from '../../types.ts';
import NavArrowIcon from './assets/nav-arrow.svg';
import './Header.scss';

interface DatePickerHeaderTitleProps {
    title?: string | null;
    focusable?: boolean;
    secondary?: boolean;
}

const DatePickerHeaderTitle = (props: DatePickerHeaderTitleProps) => {
    const titleProps = {
        className: classNames(
            'dp__header_item dp__header_title',
            { 'dp__header_sec-title': !!props.secondary },
        ),
    };

    if (props.focusable) {
        return (
            <button {...titleProps} type="button">
                {props.title}
            </button>
        );
    }

    return (
        <div {...titleProps}>
            {props.title}
        </div>
    );
};

export const DatePickerHeader: React.FC<DatePickerHeaderProps> = (props: DatePickerHeaderProps) => {
    const {
        doubleView = false,
        focusable = false,
        title = null,
        secondTitle = null,
    } = props;

    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        const target = e.target as HTMLElement;

        const isTitle = target?.closest?.('.dp__header_title');
        const isSecondTitle = doubleView && target?.closest('.dp__header_sec-title');
        if (isTitle || isSecondTitle) {
            props.onClickTitle?.({ e, secondViewTransition: !!isSecondTitle });
            return;
        }

        if (target?.closest('.dp__header_nav-prev')) {
            props.onClickPrev?.({ e });
            return;
        }

        if (target?.closest('.dp__header_nav-next')) {
            props.onClickNext?.({ e });
        }
    };

    const titleContent = (
        <DatePickerHeaderTitle
            focusable={focusable}
            title={title}
        />
    );

    const titlePlaceholder = doubleView && (
        <div className="dp__header_item dp__header-placeholder" />
    );

    const secondTitleContent = doubleView && (
        <DatePickerHeaderTitle
            focusable={focusable}
            title={secondTitle}
            secondary
        />
    );

    return (
        <div
            className="dp__header"
            onClick={onClick}
        >
            <div className="dp__header_item dp__header_nav dp__header_nav-prev">
                <NavArrowIcon className="dp__header_nav-icon" />
            </div>
            {titleContent}
            {titlePlaceholder}
            {secondTitleContent}
            <div className="dp__header_item dp__header_nav dp__header_nav-next">
                <NavArrowIcon className="dp__header_nav-icon" />
            </div>
        </div>
    );
};

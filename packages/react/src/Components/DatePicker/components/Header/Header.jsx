import PropTypes from 'prop-types';
import classNames from 'classnames';

import NavArrowIcon from './assets/nav-arrow.svg';

import './Header.scss';

const DatePickerHeaderTitle = (props) => {
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

DatePickerHeaderTitle.propTypes = {
    title: PropTypes.string,
    focusable: PropTypes.bool,
    secondary: PropTypes.bool,
};

export const DatePickerHeader = (props) => {
    const {
        doubleView = false,
        focusable = false,
        title = null,
        secondTitle = null,
    } = props;

    const onClick = (e) => {
        e.stopPropagation();

        const isTitle = e.target.closest('.dp__header_title');
        const isSecondTitle = doubleView && e.target.closest('.dp__header_sec-title');
        if (isTitle || isSecondTitle) {
            props.onClickTitle?.({ e, secondViewTransition: isSecondTitle });
            return;
        }

        if (e.target.closest('.dp__header_nav-prev')) {
            props.onClickPrev?.({ e });
            return;
        }

        if (e.target.closest('.dp__header_nav-next')) {
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

DatePickerHeader.propTypes = {
    title: PropTypes.string,
    secondTitle: PropTypes.string,
    doubleView: PropTypes.bool,
    focusable: PropTypes.bool,
    onClickTitle: PropTypes.func,
    onClickPrev: PropTypes.func,
    onClickNext: PropTypes.func,
};

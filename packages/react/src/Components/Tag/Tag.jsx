import PropTypes from 'prop-types';
import classNames from 'classnames';

import { CloseButton } from '../CloseButton/CloseButton.jsx';

import './Tag.scss';

const defaultProps = {
    active: false,
    disabled: false,
    closeable: false,
    listMode: 'list',
    onClose: null,
};

export const Tag = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const { disabled, onClose } = props;

    const closeBtn = (
        props.closeable
        && (
            <CloseButton
                className="tag__close-btn"
                tabIndex={-1}
                disabled={disabled}
                onClick={onClose}
            />
        )
    );

    return (
        <span
            className={classNames(
                'tag',
                {
                    tag_active: !!props.active,
                    tag_sort: props.listMode === 'sort',
                },
                props.className,
            )}
            disabled={disabled}
            data-id={props.id}
        >
            <span className="tag__title">{props.title}</span>
            {closeBtn}
        </span>
    );
};

Tag.selector = '.tag';
Tag.buttonClass = 'tag__close-btn';
Tag.placeholderClass = 'tag_placeholder';

Tag.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    closeable: PropTypes.bool,
    listMode: PropTypes.string,
    onClose: PropTypes.func,
    className: PropTypes.string,
};

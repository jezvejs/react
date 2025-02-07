import classNames from 'classnames';

import { CloseButton } from '../CloseButton/CloseButton.tsx';

import './Tag.scss';

export interface TagProps {
    id?: string,
    title?: string,
    active?: boolean,
    disabled?: boolean,
    closeable?: boolean,
    listMode?: string,
    onClose?: () => void,
    className?: string,
}

const defaultProps = {
    active: false,
    disabled: false,
    closeable: false,
    listMode: 'list',
};

export const Tag = (p: TagProps) => {
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
                    tag_disabled: disabled,
                },
                props.className,
            )}
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

import classNames from 'classnames';
import './ListPlaceholder.scss';

export interface DropDownListPlaceholderProps {
    content: string,
    active: boolean,
    selectable: boolean,
    className: string,
}

const defaultProps = {
    content: null,
    active: false,
    selectable: false,
};

export const DropDownListPlaceholder = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <li>
            <div
                className={classNames(
                    'dd__list-item dd__list-placeholder',
                    {
                        'dd__list-item_active': !!props.active,
                        'dd__list-placeholder_selectable': !!props.selectable,
                    },
                    props.className,
                )}
            >
                {props.content}
            </div>
        </li>
    );
};

import classNames from 'classnames';
import { DropDownListPlaceholderComponent, DropDownListPlaceholderProps } from '../../../types.ts';
import './ListPlaceholder.scss';
import { MenuPlaceholderProps } from '../../../../Menu/types.ts';

const defaultProps = {
    content: null,
    active: false,
    selectable: false,
};

export const DropDownListPlaceholder: DropDownListPlaceholderComponent = (
    p: MenuPlaceholderProps,
) => {
    const props = {
        ...defaultProps,
        ...(p as DropDownListPlaceholderProps),
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

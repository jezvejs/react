import classNames from 'classnames';
import { MenuItem, MenuItemProps } from '@jezvejs/react';

export type CustomListItemProps = MenuItemProps;
/*
export type CustomListItemProps = {
    id: string
    selected?: boolean
    active?: boolean
    hidden?: boolean
    disabled?: boolean
    multiple?: boolean
    group?: string | null
    className?: string
    title: string
};
*/

const customColors = [
    '',
    'blue',
    'red',
    'green',
    'yellow',
    'pink',
    'purple',
    'orange',
    'grey',
    'brown',
    'cyan',
    'magenta',
];

const defaultProps = {
    selected: false,
    active: false,
    hidden: false,
    disabled: false,
    multiple: false,
    group: null,
};

export type CustomListItemComponent = React.FC<CustomListItemProps> & {
    selector: string;
};

export const CustomListItem: CustomListItemComponent = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const colorId = parseInt(props.id, 10);
    const color = customColors[colorId] ?? '';

    const before = (
        <span className='dd__custom-list-item_color' data-color={color}>
            {props.multiple && (
                <span className='dd__custom-list-item_check'>&times;</span>
            )}
        </span>
    );

    return (
        <MenuItem
            {...props}
            before={before}
            className={classNames('dd__list-item', props.className)}
        />
    );
};

CustomListItem.selector = '.dd__list-item';

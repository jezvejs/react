import classNames from 'classnames';
import {
    MenuGroupHeaderProps,
    MenuGroupItemComponent,
    MenuGroupItemProps,
    MenuListProps,
} from '../../types.ts';
import './MenuGroupItem.scss';

const defaultProps = {
    items: [],
    components: {
        List: null,
        ListItem: null,
        GroupHeader: null,
    },
};

export const MenuGroupItem: MenuGroupItemComponent = (p: MenuGroupItemProps) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const { GroupHeader, List } = props.components;
    if (!GroupHeader) {
        throw new Error('Invalid group header component');
    }
    if (!List) {
        throw new Error('Invalid menu list component');
    }

    const { id, className } = props;

    const containerProps = {
        className: classNames('menu-item menu-group', className),
        'data-id': id,
    };

    const headerProps: MenuGroupHeaderProps = {
        ...props.header,
    };

    const listProps: MenuListProps = {
        ...props.list,
        id,
    };

    return (
        <div {...containerProps}>
            <GroupHeader {...headerProps} />
            <List {...listProps} />
        </div>
    );
};

MenuGroupItem.selector = '.menu-item.menu-group';

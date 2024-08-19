import classNames from 'classnames';
import { MenuGroupItem } from '../../../../Menu/Menu.tsx';
import { DropDownGroupItemComponent, DropDownGroupItemProps } from '../../../types.ts';
import './GroupItem.scss';

export const DropDownGroupItem: DropDownGroupItemComponent = (
    props: DropDownGroupItemProps,
) => (
    <MenuGroupItem
        {...props}
        className={classNames('dd__list-group', props.className)}
    />
);

DropDownGroupItem.selector = '.dd__list-group';

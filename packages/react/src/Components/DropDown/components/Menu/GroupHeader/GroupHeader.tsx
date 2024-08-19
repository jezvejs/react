import classNames from 'classnames';
import { MenuGroupHeader } from '../../../../Menu/Menu.tsx';
import { DropDownGroupHeaderComponent, DropDownGroupHeaderProps } from '../../../types.ts';
import './GroupHeader.scss';

/**
 * Menu group header component
 */
export const DropDownGroupHeader: DropDownGroupHeaderComponent = (
    props: DropDownGroupHeaderProps,
) => (
    <MenuGroupHeader
        {...props}
        className={classNames('dd__list-group__label', props.className)}
    />
);

DropDownGroupHeader.selector = '.dd__list-group__label';

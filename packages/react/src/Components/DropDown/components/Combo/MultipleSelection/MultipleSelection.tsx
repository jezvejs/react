import classNames from 'classnames';

import { Tags } from '../../../../Tags/Tags.tsx';
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.tsx';

import { DropDownMultipleSelectionComponent, DropDownMultipleSelectionProps } from '../../../types.ts';
import './MultipleSelection.scss';

export const DropDownMultipleSelection: DropDownMultipleSelectionComponent = ({
    ItemComponent = DropDownMultiSelectionItem,
    ...props
}: DropDownMultipleSelectionProps) => (
    <Tags
        {...props}
        ItemComponent={ItemComponent}
        activeItemId={props.activeItemId?.toString() ?? null}
        className={classNames('dd__selection', props.className)}
    />
);

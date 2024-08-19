import classNames from 'classnames';

import { Tag } from '../../../../Tag/Tag.tsx';

import { DropDownMultiSelectionItemComponent, DropDownMultiSelectionItemProps } from '../../../types.ts';
import './MultiSelectionItem.scss';

const defaultProps = {
    active: false,
};

export const DropDownMultiSelectionItem: DropDownMultiSelectionItemComponent = (
    p: DropDownMultiSelectionItemProps,
) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <Tag
            {...props}
            className={classNames('dd__selection-item', props.className)}
        />
    );
};

DropDownMultiSelectionItem.selector = Tag.selector;
DropDownMultiSelectionItem.buttonClass = Tag.buttonClass;
DropDownMultiSelectionItem.placeholderClass = Tag.placeholderClass;

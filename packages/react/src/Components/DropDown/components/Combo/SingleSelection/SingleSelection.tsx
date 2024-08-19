import classNames from 'classnames';
import { DropDownSingleSelectionComponent, DropDownSingleSelectionProps } from '../../../types.ts';
import './SingleSelection.scss';

export const DropDownSingleSelection: DropDownSingleSelectionComponent = (
    props: DropDownSingleSelectionProps,
) => {
    const itemTitle = props.item?.title ?? '';

    return (
        <span
            className={classNames('dd__single-selection', props.className)}
            title={itemTitle}
        >
            {itemTitle}
        </span>
    );
};

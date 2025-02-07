import { DropDownMultiSelectionItemProps } from '@jezvejs/react';
import classNames from 'classnames';

const defaultProps = {
    active: false,
    title: null,
};

export type CustomSelectionItemComponent = React.FC<DropDownMultiSelectionItemProps> & {
    selector: string;
    buttonClass: string;
};

export const CustomSelectionItem: CustomSelectionItemComponent = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <span
            className={classNames(
                'dd__selection-item dd__custom-selection-item tag',
                { 'dd__selection-item_active': props.active },
            )}
        >
            <span className='dd__del-selection-item-btn close-btn'></span>
            <span>{props.title?.toLowerCase()}</span>
        </span>
    );
};

CustomSelectionItem.selector = '.dd__selection-item';
CustomSelectionItem.buttonClass = 'dd__del-selection-item-btn';

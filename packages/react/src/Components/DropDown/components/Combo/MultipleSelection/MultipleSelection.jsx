import classNames from 'classnames';

import { Tags } from '../../../../Tags/Tags.jsx';
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.jsx';

import './MultipleSelection.scss';

export const DropDownMultipleSelection = ({
    ItemComponent = DropDownMultiSelectionItem,
    ...props
}) => (
    <Tags
        {...props}
        ItemComponent={ItemComponent}
        activeItemId={props.activeItemId.toString()}
        className={classNames('dd__selection', props.className)}
        removeItemOnClose={false}
    />
);

DropDownMultipleSelection.propTypes = {
    ...Tags.propTypes,
};

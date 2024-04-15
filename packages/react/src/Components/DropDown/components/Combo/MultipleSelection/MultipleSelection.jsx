import classNames from 'classnames';

import { Tags } from '../../../../Tags/Tags.jsx';
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.jsx';

import './MultipleSelection.scss';

export const DropDownMultipleSelection = (props) => (
    <Tags
        {...props}
        activeItemId={props.activeItemId.toString()}
        className={classNames('dd__selection', props.className)}
        removeItemOnClose={false}
    />
);

DropDownMultipleSelection.propTypes = {
    ...Tags.propTypes,
};

DropDownMultipleSelection.defaultProps = {
    ...Tags.defaultProps,
    ItemComponent: DropDownMultiSelectionItem,
};

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { componentPropType, getSelectedItems } from '../../../helpers.js';

import './MenuHeader.scss';

/**
 * Custom Menu header with Input component
 */
export const DropDownMenuHeader = (props) => {
    const { Input } = props.components;

    let placeholder = props.inputPlaceholder;
    if (!props.multiple) {
        const [item] = getSelectedItems(props);
        const str = item?.title ?? '';
        const usePlaceholder = (
            !props.useSingleSelectionAsPlaceholder
            && placeholder?.length > 0
        );
        placeholder = (usePlaceholder) ? props.inputPlaceholder : str;
    }

    return (
        <Input
            {...props}
            className={classNames('dd__list-group__label', props.className)}
            placeholder={placeholder}
            value={props.inputString}
            ref={props.inputRef}
        />
    );
};

DropDownMenuHeader.propTypes = {
    inputRef: PropTypes.object,
    inputString: PropTypes.string,
    inputPlaceholder: PropTypes.string,
    useSingleSelectionAsPlaceholder: PropTypes.bool,
    multiple: PropTypes.bool,
    onInput: PropTypes.func,
    className: PropTypes.string,
    components: PropTypes.shape({
        Input: componentPropType,
    }),
};

DropDownMenuHeader.defaultProps = {
    inputRef: null,
    inputString: '',
    inputPlaceholder: null,
    useSingleSelectionAsPlaceholder: true,
    multiple: false,
    onInput: null,
    components: {
        Input: null,
    },
};

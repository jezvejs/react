import classNames from 'classnames';
import PropTypes from 'prop-types';

import { componentPropType, getSelectedItems } from '../../../helpers.ts';

import './MenuHeader.scss';

const defaultProps = {
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

/**
 * Custom Menu header with Input component
 */
export const DropDownMenuHeader = (p) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const {
        onInput,
        disabled,
        multiple,
    } = props;
    const { Input } = props.components;

    let placeholder = props.inputPlaceholder;
    const [item] = getSelectedItems(props);
    const str = item?.title ?? '';
    if (!multiple) {
        const usePlaceholder = (
            !props.useSingleSelectionAsPlaceholder
            && placeholder?.length > 0
        );
        placeholder = (usePlaceholder) ? props.inputPlaceholder : str;
    }

    const inputProps = {
        className: classNames('dd__list-group__label', props.className),
        placeholder,
        onInput,
        disabled,
        value: props.inputString ?? ((multiple) ? '' : str),
    };

    return (
        <Input {...inputProps} ref={props.inputRef} />
    );
};

DropDownMenuHeader.propTypes = {
    inputRef: PropTypes.object,
    inputString: PropTypes.string,
    inputPlaceholder: PropTypes.string,
    useSingleSelectionAsPlaceholder: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    onInput: PropTypes.func,
    className: PropTypes.string,
    components: PropTypes.shape({
        Input: componentPropType,
    }),
};

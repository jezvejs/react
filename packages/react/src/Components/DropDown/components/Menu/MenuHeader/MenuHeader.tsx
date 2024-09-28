import classNames from 'classnames';

import { useStore } from '../../../../../utils/Store/StoreProvider.tsx';

import { getSelectedItems } from '../../../helpers.ts';
import {
    DropDownMenuHeaderComponent,
    DropDownMenuHeaderProps,
    DropDownState,
} from '../../../types.ts';

import './MenuHeader.scss';

const defaultProps = {
    inputRef: null,
    inputString: '',
    inputPlaceholder: null,
    useSingleSelectionAsPlaceholder: true,
    multiple: false,
    components: {
        Input: null,
    },
};

/**
 * Custom Menu header with Input component
 */
export const DropDownMenuHeader: DropDownMenuHeaderComponent = (p: DropDownMenuHeaderProps) => {
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
    const { Input } = props.components ?? {};

    const { getState } = useStore<DropDownState>();
    if (!Input) {
        return null;
    }

    const inputPlaceholder = props.inputPlaceholder ?? '';
    let placeholder = inputPlaceholder;
    const [item] = getSelectedItems(getState());
    const str = item?.title ?? '';
    if (!multiple) {
        const usePlaceholder = (
            !props.useSingleSelectionAsPlaceholder
            && ((placeholder?.length ?? 0) > 0)
        );
        placeholder = (usePlaceholder) ? inputPlaceholder : str;
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

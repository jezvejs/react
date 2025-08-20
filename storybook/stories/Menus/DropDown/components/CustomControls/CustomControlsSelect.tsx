import {
    DropDown,
    DropDownOnInputParam,
    DropDownProps,
    DropDownState,
    Spinner,
} from '@jezvejs/react';
import classNames from 'classnames';

import { MenuButton } from 'common/Components/MenuButton/MenuButton.tsx';

import { CustomComboBoxControls } from './ComboBoxControls/CustomComboBoxControls.tsx';
import { actions, reducer } from './reducer.ts';
import './CustomControlsSelect.scss';

const { toggleLoading } = actions;

const defaultProps = {
    loading: false,
    components: {
        ComboBoxControls: CustomComboBoxControls,
        Loading: Spinner,
        ComboMenuButton: MenuButton,
    },
};

export type CustomControlsSelectProps = Partial<DropDownProps>;
export type CustomControlsSelectComponent = React.FC<CustomControlsSelectProps>;

export const CustomControlsSelect: CustomControlsSelectComponent = (p) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const onClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;

        if (target?.closest?.('.menu-btn')) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const onInput = (params: DropDownOnInputParam<DropDownState> | null) => {
        const dispatch = params?.dispatch;
        if (!dispatch) {
            return;
        }

        dispatch(toggleLoading());
        setTimeout(() => dispatch(toggleLoading()), 500);
    };

    return (
        <DropDown
            {...props}
            className={classNames('dd__custom-combo-controls', props.className)}
            reducers={reducer}
            onClick={onClick}
            onInput={onInput}
        />
    );
};

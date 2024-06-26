import { DropDown, Spinner } from '@jezvejs/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { CustomComboBoxControls } from './ComboBoxControls/CustomComboBoxControls.jsx';
import { actions, reducer } from './reducer.js';
import { MenuButton } from '../../../../../Components/MenuButton/MenuButton.jsx';

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

export const CustomControlsSelect = (p) => {
    const props = {
        ...defaultProps,
        ...p,
        components: {
            ...defaultProps.components,
            ...(p?.components ?? {}),
        },
    };

    const onClick = (e) => {
        if (e.target.closest('.menu-btn')) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const onInput = (_, dispatch) => {
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

CustomControlsSelect.propTypes = {
    ...DropDown.propTypes,
    loading: PropTypes.bool,
};

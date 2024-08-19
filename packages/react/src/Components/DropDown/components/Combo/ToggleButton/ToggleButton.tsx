import classNames from 'classnames';

import { Button } from '../../../../Button/Button.tsx';

import { DropDownToggleButtonComponent, DropDownToggleButtonProps } from '../../../types.ts';

import ToggleIcon from './assets/toggle.svg';
import './ToggleButton.scss';

export const DropDownToggleButton: DropDownToggleButtonComponent = (
    props: DropDownToggleButtonProps,
) => (
    <Button
        {...props}
        icon={ToggleIcon}
        className={classNames('dd__toggle-btn', props.className)}
        type="static"
    />
);

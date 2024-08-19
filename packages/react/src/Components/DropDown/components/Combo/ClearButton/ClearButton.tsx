import classNames from 'classnames';
import { CloseButton } from '../../../../CloseButton/CloseButton.tsx';
import { DropDownClearButtonComponent, DropDownClearButtonProps } from '../../../types.ts';
import './ClearButton.scss';

export const DropDownClearButton: DropDownClearButtonComponent = (
    props: DropDownClearButtonProps,
) => (
    <CloseButton
        {...props}
        className={classNames('dd__clear-btn')}
        type="static"
    />
);

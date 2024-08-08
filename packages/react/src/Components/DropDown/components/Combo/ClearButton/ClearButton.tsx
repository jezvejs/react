import classNames from 'classnames';
import { CloseButton } from '../../../../CloseButton/CloseButton.tsx';
import './ClearButton.scss';

export const DropDownClearButton = (props) => (
    <CloseButton
        {...props}
        className={classNames('dd__clear-btn')}
        type="static"
    />
);

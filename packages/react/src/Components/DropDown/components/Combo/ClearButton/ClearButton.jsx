import classNames from 'classnames';
import { CloseButton } from '../../../../CloseButton/CloseButton.jsx';
import './ClearButton.scss';

export const DropDownClearButton = (props) => (
    <CloseButton
        {...props}
        className={classNames('dd__clear-btn')}
        type="static"
    />
);

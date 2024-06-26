import PropTypes from 'prop-types';
import classNames from 'classnames';
import './InputGroup.scss';

export { InputGroupInput } from './components/Input/InputGroupInput.jsx';
export { InputGroupText } from './components/Text/InputGroupText.jsx';
export { InputGroupButton } from './components/Button/InputGroupButton.jsx';
export { InputGroupInnerButton } from './components/InnerButton/InputGroupInnerButton.jsx';
export { InputGroupOuterContainer } from './components/OuterContainer/InputGroupOuterContainer.jsx';

/**
 * InputGroup component
 */
export const InputGroup = (props) => (
    <div
        className={classNames(
            'input-group',
            props.className,
        )}
    >
        {props.children}
    </div>
);

InputGroup.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
    ]),
};

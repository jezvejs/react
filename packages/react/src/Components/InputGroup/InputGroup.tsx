import PropTypes from 'prop-types';
import classNames from 'classnames';
import './InputGroup.scss';

export { InputGroupInput } from './components/Input/InputGroupInput.tsx';
export { InputGroupText } from './components/Text/InputGroupText.tsx';
export { InputGroupButton } from './components/Button/InputGroupButton.tsx';
export { InputGroupInnerButton } from './components/InnerButton/InputGroupInnerButton.tsx';
export { InputGroupOuterContainer } from './components/OuterContainer/InputGroupOuterContainer.tsx';

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

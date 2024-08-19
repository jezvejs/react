import classNames from 'classnames';
import { ReactNode } from 'react';
import './InputGroup.scss';

export { InputGroupInput } from './components/Input/InputGroupInput.tsx';
export { InputGroupText } from './components/Text/InputGroupText.tsx';
export { InputGroupButton } from './components/Button/InputGroupButton.tsx';
export { InputGroupInnerButton } from './components/InnerButton/InputGroupInnerButton.tsx';
export { InputGroupOuterContainer } from './components/OuterContainer/InputGroupOuterContainer.tsx';

export interface InputGroupProps {
    className: string,
    children: ReactNode,
}

/**
 * InputGroup component
 */
export const InputGroup = (props: InputGroupProps) => (
    <div
        className={classNames(
            'input-group',
            props.className,
        )}
    >
        {props.children}
    </div>
);

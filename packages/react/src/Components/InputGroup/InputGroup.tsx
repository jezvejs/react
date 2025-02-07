import classNames from 'classnames';
import { ReactNode } from 'react';
import './InputGroup.scss';

export * from './components/Input/InputGroupInput.tsx';
export * from './components/Text/InputGroupText.tsx';
export * from './components/Button/InputGroupButton.tsx';
export * from './components/InnerButton/InputGroupInnerButton.tsx';
export * from './components/OuterContainer/InputGroupOuterContainer.tsx';

export interface InputGroupProps {
    className?: string,
    children?: ReactNode,
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

import { ReactNode } from 'react';
import './InputGroupOuterContainer.scss';

export interface InputGroupOuterContainerProps {
    children: ReactNode,
}

export const InputGroupOuterContainer = ({ children }: InputGroupOuterContainerProps) => (
    <div className="input-group__input-outer">
        {children}
    </div>
);

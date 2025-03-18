import { CommonProps } from '../../types.ts';
import './ComponentsSectionHeader.scss';

export const ComponentsSectionHeader = ({ children }: CommonProps) => (
    <h2 className="components-section__header">{children}</h2>
);

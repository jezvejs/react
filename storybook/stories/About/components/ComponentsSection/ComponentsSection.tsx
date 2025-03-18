import { CommonProps } from '../../types.ts';
import './ComponentsSection.scss';

export const ComponentsSection = ({ children }: CommonProps) => (
    <section className="components-section">{children}</section>
);

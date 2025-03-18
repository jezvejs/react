import { CommonProps } from '../../types.ts';

export const CodeBlock = ({ children }: CommonProps) => (
    <pre className="code-block">{children}</pre>
);

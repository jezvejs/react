import { CommonProps } from '../../types.ts';

export const CodeBlockJSXTag = ({ children }: CommonProps) => (
    <>
        {'<'}<span className="code-block__jsx-tag">{children}</span>{'>'}
    </>
);

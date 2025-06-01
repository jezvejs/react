import { CommonProps } from '../../types.ts';

export interface CodeBlockJSXComponentProp {
    name: string;
    value?: string;
}

export interface CodeBlock_JSXComponentProps extends CommonProps {
    name: string;
    props?: CodeBlockJSXComponentProp[];
}

export const CodeBlockJSXComponent = (
    {
        name,
        props = [],
        children,
    }: CodeBlock_JSXComponentProps,
) => (
    <>
        {'<'}
        <span className="code-block__jsx-component">{name}</span>
        {props.map((item, index) => {
            if (!item.name) {
                return null;
            }

            const propName = (
                <span className="code-block__jsx-component-property">{item.name}</span>
            );

            return (
                <span key={`component_${name}_prop_${index}`}>
                    {(
                        (item.value)
                            ? (
                                <>
                                    {' '}
                                    {propName}
                                    <span className="code-block__js-string">
                                        {`=${item.value}`}
                                    </span>
                                </>
                            )
                            : propName
                    )}
                </span>
            );
        })}
        {'>'}
        {children}
        {'</'}
        <span className="code-block__jsx-component">{name}</span>
        {'>'}
    </>
);

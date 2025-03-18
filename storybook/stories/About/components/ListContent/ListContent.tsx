interface ListContentProps extends React.HTMLAttributes<HTMLUListElement> {
    itemsCount?: number;
    prefix?: string;
}

export const ListContent = ({ itemsCount = 5, prefix = '', ...props }: ListContentProps) => (
    <ul {...props}>
        {Array(itemsCount).fill(0).map((_, index) => (
            <li key={`${prefix}${index}`}>Item {index}</li>
        ))}
    </ul>
);

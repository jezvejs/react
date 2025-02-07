import './CustomMenuHeader.scss';

export type CustomMenuHeaderProps = {
    title?: string;
};

export const CustomMenuHeader = (props: CustomMenuHeaderProps) => (
    <div className='custom-header'>{props.title}</div>
);

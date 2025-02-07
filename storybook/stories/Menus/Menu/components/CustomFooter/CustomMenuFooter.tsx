import './CustomMenuFooter.scss';

export type CustomMenuFooterProps = {
    title?: string;
};

export const CustomMenuFooter = (props: CustomMenuFooterProps) => (
    <div className='custom-footer'>{props.title}</div>
);

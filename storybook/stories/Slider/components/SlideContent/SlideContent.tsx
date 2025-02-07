import './SlideContent.scss';

export type SlideContentProps = {
    children: React.ReactNode;
};

export const SlideContent = (props: SlideContentProps) => (
    <div className="slide-content">{props.children}</div>
);

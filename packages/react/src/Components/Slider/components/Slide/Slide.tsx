import { SlideProps } from '../../types.ts';
import './Slide.scss';

export const Slide = (props: SlideProps) => {
    const { content } = props;

    const slideProps = {
        className: 'slide',
        style: {
            width: props.width,
            height: props.height,
        },
    };

    if (props.id) {
        slideProps['data-id'] = props.id;
    }

    if (props.name) {
        slideProps['data-name'] = props.name;
    }

    return (
        <div {...slideProps} >
            {content}
        </div>
    );
};

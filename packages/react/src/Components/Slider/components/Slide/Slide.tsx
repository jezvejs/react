import classNames from 'classnames';
import { SlideProps } from '../../types.ts';
import './Slide.scss';

export interface SlideAttrs {
    className?: string;
    style?: React.CSSProperties;
    'data-id'?: string;
    'data-name'?: string;
}

export const Slide = (props: SlideProps) => {
    const { content } = props;

    const slideProps: SlideAttrs = {
        className: classNames('slide', props.className),
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

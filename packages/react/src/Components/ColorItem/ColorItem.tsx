import classNames from 'classnames';
import './ColorItem.scss';

export interface ColorItemProps {
    className: string,
    value: string,
    colorProp: string,
}

/**
 * ColorItem component
 */
export const ColorItem = (props: ColorItemProps) => {
    const {
        value = '',
        colorProp = '--color-item-value',
    } = props;

    const colorItemProps = {
        className: classNames('color-item', props.className),
        style: {
            [colorProp]: value,
        },
    };

    return (
        <div {...colorItemProps} />
    );
};

import classNames from 'classnames';
import { DropDownPlaceholderComponent, DropDownPlaceholderProps } from '../../../types.ts';
import './Placeholder.scss';

const defaultProps = {
    placeholder: '',
};

export const DropDownPlaceholder: DropDownPlaceholderComponent = (
    p: DropDownPlaceholderProps,
) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const placeholder = props.placeholder ?? '';

    return (
        <span
            {...props}
            className={classNames('dd__placeholder', props.className)}
            title={placeholder}
        >
            {placeholder}
        </span>
    );
};
import classNames from 'classnames';

import './Spinner.scss';

export interface SpinnerProps {
    id: string,
    className: string,
}

/**
 * Spinner component
 */
export const Spinner = (props: SpinnerProps) => {
    const {
        className,
        ...rest
    } = props;

    return (
        <div
            className={classNames('spinner', className)}
            {...rest}
        />
    );
};

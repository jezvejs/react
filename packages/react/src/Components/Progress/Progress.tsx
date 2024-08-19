import classNames from 'classnames';

import './Progress.scss';

export interface ProgressProps {
    id: string,
    className: string,
    disabled: boolean,
    value: number,
}

const defaultProps = {
    disabled: false,
    value: 0,
};

/**
 * Progress component
 */
export const Progress = (p: ProgressProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        className,
        value,
        ...rest
    } = props;

    const width = Math.max(0, Math.min(100, value));

    return (
        <div
            className={classNames('progress', className)}
            {...rest}
        >
            <div
                className="progress-bar"
                style={{ width: `${width}%` }}
            />
        </div>
    );
};

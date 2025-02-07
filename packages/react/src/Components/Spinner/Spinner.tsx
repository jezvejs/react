import classNames from 'classnames';
import './Spinner.scss';

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Spinner component
 */
export const Spinner = (props: SpinnerProps) => (
    <div
        {...props}
        className={classNames('spinner', props.className)}
    />
);

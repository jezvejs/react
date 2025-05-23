import classNames from 'classnames';

import './IndetermProgress.scss';
import { useMemo } from 'react';

export interface IndetermProgressProps {
    id?: string;
    className?: string;
    run?: boolean;
    circlesCount?: number;
}

const generateId = () => (
    Math.round(Date.now() * Math.random() * 100000).toString(30)
);

const defaultProps = {
    run: true,
    circlesCount: 5,
};

/**
 * IndetermProgress component
 */
export const IndetermProgress = (p: IndetermProgressProps) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const {
        circlesCount,
        run,
        className,
        ...rest
    } = props;

    const circles = useMemo(() => (
        Array(circlesCount).fill('indtp').map((item) => (
            `${item}${generateId()}`
        ))
    ), []);

    return (
        <div
            className={classNames('indeterm-progress', { run }, className)}
            {...rest}
        >
            {circles.map((id) => (
                <div key={id} className="indeterm-progress__circle" />
            ))}
        </div>
    );
};

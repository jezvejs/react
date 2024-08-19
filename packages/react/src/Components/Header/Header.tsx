import { ReactNode } from 'react';
import classNames from 'classnames';
import './Header.scss';

export interface HeaderProps {
    id: string,
    className: string,
    children: ReactNode,
}

/**
 * Header component
 */
export const Header = (props: HeaderProps) => (
    <header
        {...props}
        className={classNames('header', props.className)}
    >
        {props.children}
    </header>
);

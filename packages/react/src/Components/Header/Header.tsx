import classNames from 'classnames';
import './Header.scss';

export type HeaderProps = React.HTMLAttributes<HTMLElement>;

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

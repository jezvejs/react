import LogoIcon from '../../../../common/assets/images/logo.svg';

import './LogoHeader.scss';

export const LogoHeader = () => (
    <header className="logo-header">
        <div className="logo-container">
            <LogoIcon className="logo-icon" />
            <div className="logo-description">
                <p className="logo-title">Jezve<b>JS</b> React</p>
                <p className="logo-subtitle">Components and utility library</p>
            </div>
        </div>
        <p className="description">Components and utilities to organize development of pet project.</p>
    </header>
);

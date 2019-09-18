import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export interface HeaderProps {
    isVisible: boolean;
    service: string;
    serviceLink: string;
}

class Header extends Component<HeaderProps> {

    createLogotype(service: string, serviceLink: string) {
        return (
            <div className="govuk-header__container govuk-width-container">
                <div className="govuk-header__logo">
                    <span className="govuk-header__logotype">
                        <Link to={serviceLink} className="govuk-header__link govuk-header__link--homepage govuk-header__logotype-text">{service}</Link>
                    </span>
                </div>
                <div className="govuk-header__content">
                    <nav>
                        <ul id="navigation" className="govuk-header__navigation " aria-label="Top Level Navigation">
                            <li className="govuk-header__navigation--end">
                                <a href="/oauth/logout?redirect=/" className="govuk-header__link">Logout</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    render() {
        const { service = 'Correspondence Service', serviceLink = '/' } = this.props;
        return (
            <header className="govuk-header " role="banner" data-module="header">
                <div className="govuk-header__container govuk-width-container">
                    {this.createLogotype(service, serviceLink)}
                </div>
            </header>
        );
    }

}

export default Header;

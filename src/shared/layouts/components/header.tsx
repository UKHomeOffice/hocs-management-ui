import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { HeaderConfig } from 'shared/models/config';

class Header extends Component<HeaderConfig> {

    createLogotype(service: string, serviceLink: string, logoutRedirectUrl: string) {
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
                                <a href={`/oauth/logout?redirect=${logoutRedirectUrl}`} className="govuk-header__link">Log out</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    render() {
        const {
            service = 'Correspondence Service',
            serviceLink = '/',
            logoutRedirectUrl = '/'
        } = this.props;
        return (
            <header className="govuk-header " role="banner" data-module="header">
                <div className="govuk-header__container govuk-width-container">
                    {this.createLogotype(service, serviceLink, logoutRedirectUrl)}
                </div>
            </header>
        );
    }

}

export default Header;

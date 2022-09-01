import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { HeaderConfig } from 'shared/models/config';

class Header extends Component<HeaderConfig> {

    createLogotype(service: string, serviceLink: string) {
        return (
            <div className="govuk-header__container govuk-width-container">
                <div className="govuk-header__logo">
                    <span className="govuk-header__logotype">
                        <Link to={serviceLink} className="govuk-header__link govuk-header__link--homepage govuk-header__logotype-text">{service}</Link>
                    </span>
                </div>
                <div className="govuk-header__content">
                    <nav aria-label="Top Level Navigation" className="govuk-header__navigation">
                        <ul id="navigation" className="govuk-header__navigation-list">
                            <li className="govuk-header__navigation--end">
                                <a href="/oauth/logout" className="govuk-header__link">Log out</a>
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

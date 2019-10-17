import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => (
    <Fragment>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <h1 className="govuk-heading-l">Choose an area to manage</h1>
                <ul className="govuk-list">
                    <li>
                        <h3 className="govuk-heading-m">
                            Standard Lines
                        </h3>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <Link className="govuk-link" to="/add-standard-line">Add a Standard Line</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3 className="govuk-heading-m">
                            Team Management
                        </h3>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <Link className="govuk-link" to="/team-search">Add/Remove Users</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3 className="govuk-heading-m">
                            Topic Management
                        </h3>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <Link className="govuk-link" to="/add-child-topic">Add Child Topic</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3 className="govuk-heading-m">
                            Unit Management
                        </h3>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <Link className="govuk-link" to="/add-unit">Add a Unit</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </Fragment>
);

export default Dashboard;

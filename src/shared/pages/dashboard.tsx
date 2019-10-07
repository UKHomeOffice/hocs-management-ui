import React, { Fragment } from 'react';

const Dashboard: React.FC = () => (
    <Fragment>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <h1 className="govuk-heading-l">Choose an area to manage</h1>
                <ul className="govuk-list">
                    <li>
                        <h3 className="govuk-heading-m">
                            Team Management
                        </h3>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <a className="govuk-link" href="/team-search">Add/Remove Users</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3 className="govuk-heading-m">
                            Topic Management
                        </h3>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <a className="govuk-link" href="/add-child-topic">Add Child Topic</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3 className="govuk-heading-m">
                            Unit Management
                        </h3>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <a className="govuk-link" href="/add-unit">Add a Unit</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </Fragment>
);

export default Dashboard;

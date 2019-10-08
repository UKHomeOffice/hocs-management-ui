import React, { Fragment } from 'react';

const Dashboard: React.FC = () => (
    <Fragment>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <h2 className="govuk-heading-l">Choose an area to manage</h2>
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
                            Unit Management
                        </h3>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <a className="govuk-link" href="/add-unit">Add a Unit</a>
                            </li>
                            <li>
                                <a className="govuk-link" href="/unit-search">View Units and their teams</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </Fragment>
);

export default Dashboard;

import React from 'react';
import { Location } from 'history';

interface SuccessMessageProps {
    location: Location<any>;
}
const successMessage: React.FC<SuccessMessageProps> = ({ location: { state: { successMessage } = {} } }) => successMessage ? (
    <div className="panel panel-border-wide alert-success">
        <h2 className="govuk-heading-s">Success</h2>
        <p className="govuk-body">
            {successMessage}
        </p>
    </div>
) : (<></>);

export default successMessage;

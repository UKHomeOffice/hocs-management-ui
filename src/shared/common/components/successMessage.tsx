import React from 'react';
import { Location } from 'history';

interface SuccessState {
    successMessage: string;
}

interface SuccessMessageProps {
    location: Location<SuccessState>;
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

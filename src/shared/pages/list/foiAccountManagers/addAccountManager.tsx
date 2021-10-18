import React, { Reducer } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { ApplicationConsumer } from '../../../contexts/application';
import { createListItem } from '../../../services/entityListService';
import { reducer } from './addAccountManagerReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import {
    GENERAL_ERROR_TITLE,
    VALIDATION_ERROR_TITLE,
    ADD_FOI_ACCOUNT_MANAGER_SUCCESS, DUPLICATE_FOI_ACCOUNT_MANAGER_DESCRIPTION, ADD_FOI_ACCOUNT_MANAGER_ERROR_DESCRIPTION
} from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import EntityListItem from '../../../models/entityListItem';
import { validate } from '../../../validation';
import InputEventData from '../../../models/inputEventData';

interface AddCampaignProps extends RouteComponentProps {
    csrfToken?: string;
}

const validationSchema = object({
    title: string()
        .required()
        .label('Account manager name')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/),
    simpleName: string()
        .required()
        .label('Account manager code')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
});

const AddAccountManager: React.FC<AddCampaignProps> = ({ csrfToken, history }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [accountManager, dispatch] = React.useReducer<Reducer<EntityListItem, InputEventData>>(reducer, {
        uuid: '',
        title: '',
        simpleName: ''
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, accountManager, addFormError)) {
            createListItem(accountManager, 'FOI_ACCOUNT_MANAGERS').then(() => {
                history.push('/', { successMessage: ADD_FOI_ACCOUNT_MANAGER_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 409) {
                    setErrorMessage(new ErrorMessage(DUPLICATE_FOI_ACCOUNT_MANAGER_DESCRIPTION, VALIDATION_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(ADD_FOI_ACCOUNT_MANAGER_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/manage-foi-account-managers" className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Add account manager
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action="/api/entity/list/FOI_ACCOUNT_MANAGERS" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="New account manager name"
                            name="title"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={accountManager.title}
                        />
                        <Text
                            label="Account manager code"
                            name="simpleName"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={accountManager.simpleName}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAddUnit = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <AddAccountManager csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedAddUnit;

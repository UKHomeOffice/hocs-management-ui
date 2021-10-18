import React, { Reducer, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { ApplicationConsumer } from '../../../contexts/application';
import { updateListItem, getItemDetails } from '../../../services/entityListService';
import { reducer } from './amendAccountManagerReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import {
    GENERAL_ERROR_TITLE,
    VALIDATION_ERROR_TITLE,
    LOAD_FOI_ACCOUNT_MANAGERS_ERROR_DESCRIPTION,
    AMEND_FOI_ACCOUNT_MANAGER_SUCCESS, AMEND_FOI_ACCOUNT_MANAGER_ERROR_DESCRIPTION
} from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import { validate } from '../../../validation';
import { Action } from './actions';
import { State } from './amendAccountManagerState';

interface MatchParams {
    itemUUID: string;
}
interface AmendAccountManagerProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
}

const validationSchema = object({
    title: string()
        .required()
        .label('New account manager name')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
});

const AmendAccountManager: React.FC<AmendAccountManagerProps> = ({ csrfToken, history, match }) => {
    const initialState: State = {
        uuid: '',
        title: '',
        originalTitle: '',
        simpleName: ''
    };

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    const { params: { itemUUID } } = match;

    useEffect(() => {
        getItemDetails(itemUUID)
            .then(item => dispatch({ type: 'SetItemDetails', payload: item }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_FOI_ACCOUNT_MANAGERS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, state, addFormError)) {
            updateListItem(state, 'FOI_ACCOUNT_MANAGERS').then(() => {
                history.push('/', { successMessage: AMEND_FOI_ACCOUNT_MANAGER_SUCCESS });
            }).catch((error) => {
                setErrorMessage(new ErrorMessage(AMEND_FOI_ACCOUNT_MANAGER_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
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
                        Amend account manager
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <h3 className="govuk-heading-l">
                        {`New account manager name: ${state.originalTitle}`}
                    </h3>
                    <form action="/api/entity/list/update/FOI_ACCOUNT_MANAGERS" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="New account manager name"
                            name="title"
                            type="text"
                            updateState={({ value }) => dispatch({ type: 'SetTitle', payload: value as string })}
                            value={state.title}
                        />
                        <Text
                            label="New account manager code"
                            name="simpleName"
                            type="text"
                            disabled={true}
                            updateState={({ value }) => dispatch({ type: 'SetSimpleName', payload: value as string })}
                            value={state.simpleName}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAmendAccountManager = ({ history, location, match }: RouteComponentProps<MatchParams>) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <AmendAccountManager csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedAmendAccountManager;

import React, { Reducer, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { ApplicationConsumer } from '../../../contexts/application';
import { reducer } from './reducer';
import ErrorSummary from '../../../common/components/errorSummary';
import useError from '../../../hooks/useError';
import * as constants from '../../../models/constants';
import ErrorMessage from '../../../models/errorMessage';
import InputEventData from '../../../models/inputEventData';
import { validate } from '../../../validation';
import State from './state';
import { getUser, updateUser } from '../../../services/usersService';
import { User } from '../../../models/user';

interface MatchParams {
    userUUID: string;
}
interface AmendUserProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
}

const validationSchema = object({
    firstName: string()
        .required()
        .label('First Name')
        .max(50),
    lastName: string()
        .required()
        .label('Last Name')
        .max(50)
});


const AmendUser: React.FC<AmendUserProps> = ({ csrfToken, history, match }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', constants.VALIDATION_ERROR_TITLE);

    const { params: { userUUID } } = match;
    const initialState: State = {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        enabled: 'false'
    };

    useEffect(() => {
        getUser(userUUID)
            .then((user: User) => {
                dispatch({ name: 'username', value: user.username });
                dispatch({ name: 'email', value: user.email });
                dispatch({ name: 'firstName', value: user.firstName });
                dispatch({ name: 'lastName', value: user.lastName });
                dispatch({ name: 'enabled', value: Boolean(user.enabled).toString() });
            })
            .catch(() => {
                setErrorMessage(new ErrorMessage(constants.LOAD_USER_ERROR_DESCRIPTION, constants.GENERAL_ERROR_TITLE));
            });
    }, []);

    const [state, dispatch] = React.useReducer<Reducer<State, InputEventData>>(reducer, initialState);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, state, addFormError)) {
            updateUser({  uuid: userUUID, firstName: state.firstName, lastName: state.lastName, enabled: (state.enabled == 'true') }).then(() => {
                history.push(`/user-view/${userUUID}`, { successMessage: constants.AMEND_USER_SUCCESS });
            }).catch((error: any) => {
                let errorMessage;
                if (error.response.status >= 400 && error.response.status <= 499) {
                    errorMessage = new ErrorMessage(error.response.data.message, constants.AMEND_USER_BAD_REQUEST_TITLE);
                } else {
                    errorMessage = new ErrorMessage(constants.AMEND_USER_ERROR_DESCRIPTION, constants.AMEND_USER_ERROR_TITLE);
                }
                setErrorMessage(errorMessage);
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to={`/user-view/${userUUID}`} className="govuk-back-link">Back</Link>
                    <ErrorSummary pageError={pageError} />
                    <h1 className="govuk-heading-xl">
                        Amend User Details
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form method="POST" onSubmit={handleSubmit}>
                        { state.enabled == 'false' && <p><strong className="govuk-tag govuk-tag--grey">Disabled</strong></p> }
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="Username"
                            name="username"
                            type="text"
                            disabled
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={state.username}
                        />
                        <Text
                            label="Email Address"
                            name="email"
                            type="text"
                            disabled
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={state.email}
                        />
                        <Text
                            label="First Name"
                            name="firstName"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={state.firstName}
                        />
                        <Text
                            label="Last Name"
                            name="lastName"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={state.lastName}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAmendUser = ({ history, location, match }: RouteComponentProps<MatchParams>) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <AmendUser csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedAmendUser;

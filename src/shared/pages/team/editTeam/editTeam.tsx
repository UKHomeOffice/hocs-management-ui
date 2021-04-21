import React, { useEffect, useReducer } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Text from '../../../common/components/forms/text';
import ErrorSummary from '../../../common/components/errorSummary';
import useError from '../../../hooks/useError';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { ApplicationConsumer } from '../../../contexts/application';
import { object, string } from 'yup';
import { validate } from '../../../validation';
import { getTeam, updateTeamName } from '../../../services/teamsService';
import ErrorMessage from '../../..//models/errorMessage';
import { GENERAL_ERROR_TITLE, LOAD_TEAM_ERROR_DESCRIPTION, TEAM_RENAME_FAILED_NAME_ALREADY_EXISTS, TEAM_RENAME_FAILED_UNKNOWN_ERROR, VALIDATION_ERROR_TITLE } from '../../../models/constants';

interface MatchParams {
    teamId: string;
}

interface EditTeamProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
}

const validationSchema = object({
    newDisplayName: string()
        .required()
        .label('new team name')
});

const EditTeam: React.FC<EditTeamProps> = ({ csrfToken, history, match }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [state, dispatch] = useReducer(reducer, initialState);

    const { params: { teamId } } = match;

    useEffect(() => {
        getTeam(teamId)
            .then(team => {
                return dispatch({ type: 'SetCurrentTeamName', payload: team.displayName });
            })
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();

        if (validate(validationSchema, state, addFormError)) {
            updateTeamName(teamId, state.newDisplayName).then(() => {
                history.push(`/team-view/${teamId}`, { successMessage: `Team name changed from ${state.currentDisplayName} to ${state.newDisplayName}.` });
            }).catch((error) => {
                if (error && error.response && error.response.status === 409) {
                    setErrorMessage(
                        new ErrorMessage(TEAM_RENAME_FAILED_NAME_ALREADY_EXISTS, GENERAL_ERROR_TITLE)
                    );
                } else {
                    setErrorMessage(new ErrorMessage(TEAM_RENAME_FAILED_UNKNOWN_ERROR, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to={`/team-view/${teamId}`} className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Edit {state.currentDisplayName}
                    </h1>
                </div>
            </div>

            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <form method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="New team name"
                            name="newTeamName"
                            type="text"
                            updateState={
                                ({ value }) => dispatch({ type: 'SetNewTeamName', payload: value as string })
                            }
                            value={state.newDisplayName}
                        />

                        <div className="govuk-form-group">
                            <button type="submit" className="govuk-button">Update</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedEditTeam = (routeProps: RouteComponentProps<MatchParams>) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <EditTeam csrfToken={csrf} {...routeProps} />
        )}
    </ApplicationConsumer>
);

export default WrappedEditTeam;

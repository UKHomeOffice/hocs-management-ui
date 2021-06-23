import React, { useEffect, useReducer } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Text from '../../../common/components/forms/text';
import ErrorSummary from '../../../common/components/errorSummary';
import useError from '../../../hooks/useError';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { ApplicationConsumer, ApplicationState } from '../../../contexts/application';
import { object, string } from 'yup';
import { validate } from '../../../validation';
import { getTeam, getUnitForTeam, updateTeam } from '../../../services/teamsService';
import ErrorMessage from '../../..//models/errorMessage';
import {
    GENERAL_ERROR_TITLE,
    LOAD_TEAM_ERROR_DESCRIPTION,
    TEAM_UPDATE_FAILED_UNKNOWN_ERROR,
    VALIDATION_ERROR_TITLE
} from '../../../models/constants';
import { getUnitsForTypeAhead } from '../../../services/unitsService';
import TypeAhead from '../../../common/components/typeAhead';
import { TeamPatch } from './TeamPatch';

interface MatchParams {
    teamId: string;
}

interface EditTeamProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
    hasRole: (role: string) => boolean;
}

const validationSchema = object({
    newDisplayName: string()
        .required()
        .label('new team name')
});


const EditTeam: React.FC<EditTeamProps> = ({ csrfToken, history, match, hasRole }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [state, dispatch] = useReducer(reducer, initialState);

    const { params: { teamId } } = match;

    useEffect(() => {
        getTeam(teamId)
            .then(team => {
                dispatch({ type: 'SetCurrentTeamName', payload: team.displayName });
            })
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
        getUnitForTeam(teamId)
            .then(unit => dispatch({ type: 'SetUnitInitial', payload: { label: unit.displayName, value: unit.type } }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();

        const changesInPatch: Array<string> = [];
        const teamPatch:TeamPatch = {};

        if (validate(validationSchema, state, addFormError)) {
            if (state.newDisplayName !== state.currentDisplayName) {
                teamPatch.displayName = state.newDisplayName;
                changesInPatch.push(`Team name changed from ${state.currentDisplayName} to ${state.newDisplayName}.`);
            }

            if (state.unit?.value !== state.initialUnit?.value) {
                teamPatch.unitUUID = state.unit?.value;
                changesInPatch.push(`Team unit changed from ${state.initialUnit?.label} to ${state.unit?.label}.`);
            }

            if (Object.keys(teamPatch).length > 0) {

                await updateTeam(teamId, teamPatch).then(() => {
                    history.push(`/team-view/${teamId}`, { successMessage: changesInPatch.join(' ') });
                }).catch((error) => {
                    setErrorMessage(
                        new ErrorMessage(error.response.data.body || TEAM_UPDATE_FAILED_UNKNOWN_ERROR, GENERAL_ERROR_TITLE)
                    );

                });
            } else {
                history.push(`/team-view/${teamId}`);
            }
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
                        {(hasRole('RENAME_TEAM')) && <Text
                            label="New team name"
                            name="newTeamName"
                            type="text"
                            updateState={
                                ({ value }) => dispatch({ type: 'SetNewTeamName', payload: value as string })
                            }
                            value={state.newDisplayName}
                        />}
                        {(hasRole('REASSIGN_TEAM_UNIT')) && <TypeAhead
                            clearable={true}
                            disabled={false}
                            getOptions={getUnitsForTypeAhead(setErrorMessage)}
                            label={'Unit'}
                            name={'unit'}
                            value={{ label: state.unit?.label || '', value: '' }}

                            onSelectedItemChange={
                                (item ) => dispatch({ type: 'SetUnit', payload: item })
                            }
                        />}

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
        {({ csrf, hasRole }: ApplicationState) => (
            <EditTeam csrfToken={csrf} {...routeProps} hasRole={hasRole}/>
        )}
    </ApplicationConsumer>
);

export default WrappedEditTeam;

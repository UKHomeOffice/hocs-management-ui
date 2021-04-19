import React, { useReducer, useCallback } from 'react';
import { History } from 'history';
import { Link, RouteComponentProps } from 'react-router-dom';
import Text from '../../../common/components/forms/text';
import ErrorSummary from '../../../common/components/errorSummary';
import useError from '../../../hooks/useError';
import {
    GENERAL_ERROR_TITLE, LOAD_UNITS_ERROR_DESCRIPTION,
    TEAM_CREATION_FAILURE_NAME_ALREADY_EXISTS, TEAM_CREATION_FAILURE_UNKNOWN_ERROR, TEAM_CREATION_SUCCESS,
    VALIDATION_ERROR_TITLE,
} from '../../../models/constants';
import TypeAhead from '../../../common/components/typeAhead';
import { getUnits } from '../../../services/unitsService';
import ErrorMessage from '../../../models/errorMessage';
import Item from '../../../models/item';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { ApplicationConsumer } from '../../../contexts/application';
import { object, string } from 'yup';
import { validate } from '../../../validation';
import { addTeam } from '../../../services/teamsService';
interface AddTeamProps {
    csrfToken?: string;
    history: History;
}

const validationSchema = object({
    team: object({
        displayName: string()
            .required()
            .label('Team name'),
        unitUUID: string()
            .required()
            .label('Unit')
    })
});

const AddTeam: React.FC<AddTeamProps> = ({ csrfToken,history }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError();
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, state, addFormError)) {
            addTeam(state.team).then(() => {
                history.push('/add-team', { successMessage: TEAM_CREATION_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 409) {
                    setErrorMessage(
                        new ErrorMessage(TEAM_CREATION_FAILURE_NAME_ALREADY_EXISTS, VALIDATION_ERROR_TITLE)
                    );
                } else {
                    setErrorMessage(new ErrorMessage(TEAM_CREATION_FAILURE_UNKNOWN_ERROR, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    const getUnitsForTypeAhead = useCallback(() => new Promise<Item[]>(resolve => getUnits()
        .then((units) => {
            const items: Item[] = [];
            units.forEach(function (unit){
                items.push({ label: unit.displayName, value: unit.type });
            });
            resolve(items);
        })
        .catch(() => {
            //change
            setErrorMessage(new ErrorMessage(LOAD_UNITS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            resolve([]);
        })
    ),[]);

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/" className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Create a DCU drafting team
                    </h1>
                </div>
            </div>

            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <form method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="Team name"
                            name="teamName"
                            type="text"
                            updateState={
                                ({ value }) => dispatch({ type: 'SetTeamName', payload: value as string })
                            }
                            value={state.team.displayName}
                        />

                        <TypeAhead
                            clearable={true}
                            disabled={false}
                            getOptions={getUnitsForTypeAhead}
                            label={'Unit'}
                            name={'unit'}
                            onSelectedItemChange={
                                ({ value  }) => dispatch({ type: 'SetUnit', payload: value as string })
                            }
                        />

                        <div className="govuk-form-group">
                            <button type="submit" className="govuk-button view-team-button" >Add</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAddTeam = ({ history }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <AddTeam csrfToken={csrf} history={history} />
        )}
    </ApplicationConsumer>
);

export default WrappedAddTeam;

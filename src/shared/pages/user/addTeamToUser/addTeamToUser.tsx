import React, { useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { addUsersToTeam, getUser } from '../../../services/usersService';
import Item from '../../../models/item';
import { ADD_USER_ERROR_DESCRIPTION, ADD_USER_ERROR_TITLE, ADD_USER_TO_TEAM_SUCCESS, EMPTY_TEAMS_SUBMIT_ERROR_DESCRIPTION, EMPTY_TEAMS_SUBMIT_ERROR_TITLE, GENERAL_ERROR_TITLE, LOAD_TEAMS_ERROR_DESCRIPTION, LOAD_USER_ERROR_DESCRIPTION } from '../../../models/constants';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import ErrorSummary from '../../../common/components/errorSummary';
import TypeAhead from '../../../common/components/typeAhead';
import { getTeams } from '../../../services/teamsService';
import ErrorMessage from '../../../models/errorMessage';
import { initialState, reducer } from './reducer';
import { User } from '../../../models/user';

interface MatchParams {
    userId: string;
}

export type AddToTeamProps = RouteComponentProps<MatchParams>;

const AddTeamToUser: React.FC<AddToTeamProps> = ({ history, match }) => {

    const [state, dispatch] = React.useReducer(reducer, initialState);

    const [pageError, , clearErrors, setErrorMessage] = useError(ADD_USER_ERROR_DESCRIPTION, ADD_USER_ERROR_TITLE);
    const { params: { userId } } = match;

    useEffect(() => {
        clearErrors();
        getUser(userId)
            .then((user: User) => dispatch({ type: 'SetUser', payload: user }))
            .catch(()  => {
                setErrorMessage(new ErrorMessage(LOAD_USER_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const onSelectedTeamChange = useCallback((selectedTeam: Item) => {
        clearErrors();
        dispatch({ type: 'AddToSelectedTeams', payload: selectedTeam });
        dispatch({ type: 'ClearSelectedTeam' });
    }, []);

    const onSubmit = () => {
        clearErrors();
        const selectedTeams = state.selectedTeams;
        if (selectedTeams.length === 0) {
            setErrorMessage(new ErrorMessage(EMPTY_TEAMS_SUBMIT_ERROR_DESCRIPTION, EMPTY_TEAMS_SUBMIT_ERROR_TITLE));
            return;
        }
        if (selectedTeams.length > 0) {
            selectedTeams.forEach((team) => {
                const user = state.user;
                if (user !== undefined) {
                    addUsersToTeam([{ label: user.username, value: user.id }], team.value)
                        .then(() => dispatch({ type: 'RemoveFromSelectedTeams', payload: team }))
                        .catch(() => {
                            setErrorMessage(new ErrorMessage(ADD_USER_ERROR_TITLE, ADD_USER_ERROR_DESCRIPTION));
                        })
                        .then(() => {
                            history.push(`/user-view/${user.id}`, { successMessage: ADD_USER_TO_TEAM_SUCCESS });
                        });
                }
            });
        }
    };

    const getTeamsForTypeahead = useCallback(() => new Promise<Item[]>(
        resolve => getTeams()
            .then((teams: Item[]) => resolve(teams))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAMS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                resolve([]);
            })), []);

    return (
        <>
            <div className="govuk-form-group">
                <Link className="govuk-back-link" to={`/user-view/${userId}`}>Back</Link>
                <ErrorSummary pageError={pageError}/>
                <h1 className="govuk-heading-xl">Add Teams</h1>
                {
                    state.user ?
                        <h2 className="govuk-heading-l">{`User: ${state.user.firstName} ${state.user.lastName} (${state.user.email})`}</h2> :
                        <h2>User: Loading...</h2>
                }
                <TypeAhead
                    clearable={true}
                    disabled={false}
                    getOptions={getTeamsForTypeahead}
                    label={'Select teams'}
                    name={'select-teams'}
                    onSelectedItemChange={onSelectedTeamChange}
                    value = {state.selectedTeam}
                />

                {state.selectedTeams.length > 0 &&
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds-from-desktop">
                        <table className="govuk-table">
                            <caption className="govuk-table__caption">Teams to be added</caption>
                            <tbody className="govuk-table__body">
                                {state.selectedTeams.map(team => (
                                    <tr key={team.value} className="govuk-table__row">
                                        <th scope="row" className="govuk-table__header">
                                            {team.label}
                                        </th>
                                        <td className="govuk-table__cell">
                                            <a className="govuk-link" href="#" onClick={() => dispatch({ type: 'RemoveFromSelectedTeams', payload: team })}>
                                                Remove<span className="govuk-visually-hidden"> user</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                }
                <button
                    type="submit"
                    className="govuk-button view-team-button"
                    onClick={onSubmit}
                >
                Add selected teams
                </button>
            </div>
        </>
    );
};
export default AddTeamToUser;

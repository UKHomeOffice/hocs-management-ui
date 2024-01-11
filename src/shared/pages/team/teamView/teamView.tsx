import React, { Reducer, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import { deleteUserFromTeam } from '../../../services/usersService';
import { getTeam, getTeamMembers, getUnitForTeam } from '../../../services/teamsService';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { ListUser } from '../../../models/listUser';
import {
    GENERAL_ERROR_TITLE,
    LOAD_TEAM_ERROR_DESCRIPTION,
    LOAD_TEAM_MEMBERS_ERROR_DESCRIPTION,
    REMOVE_FROM_TEAM_ERROR_DESCRIPTION,
    VALIDATION_ERROR_TITLE,
    REMOVE_FROM_TEAM_ALLOCATED_ERROR_DESCRIPTION,
} from '../../../models/constants';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import { ApplicationConsumer, ApplicationState } from '../../../contexts/application';

interface MatchParams {
    teamId: string;
}

interface TeamMembersProps extends RouteComponentProps<MatchParams> {
    hasOneOfRoles(roles: string[]): boolean;

    hasRole(role: string): boolean;
}

const onAddTeamMembersAddClick = (history: History, teamId: string) => {
    history.push(`/team/${teamId}/add-users`);
};

const onAddNominatedContactClick = (history: History, teamId: string) => {
    history.push(`/team/${teamId}/manage-nominated-contacts`);
};

const onEditTeamAddClick = (history: History, teamId: string) => {
    history.push(`/team/${teamId}/edit`);
};

const onReactivateTeamAddClick = (history: History, teamId: string) => {
    history.push(`/team/${teamId}/reactivate`);
};

const onDeactivateTeamAddClick = (history: History, teamId: string) => {
    history.push(`/team/${teamId}/deactivate`);
};

const TeamView: React.FC<TeamMembersProps> =
    ({ history, match, hasOneOfRoles, hasRole }) => {
        const [pageError, , clearErrors, setErrorMessage] = useError();
        const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

        const { params: { teamId } } = match;

        useEffect(() => {
            getTeam(teamId)
                .then(team => {
                    dispatch({ type: 'SetTeamName', payload: team.displayName });
                    dispatch({ type: 'SetTeamActive', payload: team.active });
                })
                .catch(() => {
                    setErrorMessage(new ErrorMessage(LOAD_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                });
            getUnitForTeam(teamId)
                .then(unit => {
                    dispatch({ type: 'SetTeamUnitName', payload: unit.displayName });
                })
                .catch(() => {
                    setErrorMessage(new ErrorMessage(LOAD_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                });
            getTeamMembers(teamId)
                .then((users: ListUser[]) => dispatch({ type: 'PopulateTeamMembers', payload: users }))
                .catch(() => {
                    setErrorMessage(new ErrorMessage(LOAD_TEAM_MEMBERS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                });
        }, []);

        const removeTeamMember = (userUUID: string, teamId: string, event: React.FormEvent) => {
            event.preventDefault();
            clearErrors();
            deleteUserFromTeam(userUUID, teamId)
                .then(() => {
                    getTeamMembers(teamId)
                        .then((users: ListUser[]) => dispatch({ type: 'PopulateTeamMembers', payload: users }))
                        .catch(() => {
                            setErrorMessage(new ErrorMessage(LOAD_TEAM_MEMBERS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                        });
                })
                .catch((error) => {
                    if (error && error.response && error.response.status === 409) {
                        setErrorMessage(new ErrorMessage(REMOVE_FROM_TEAM_ALLOCATED_ERROR_DESCRIPTION, VALIDATION_ERROR_TITLE));
                    } else {
                        setErrorMessage(new ErrorMessage(REMOVE_FROM_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                    }
                });
        };

        const DisplayTeamTable = () => (
            <Fragment>
                {state.teamMembersLoaded && (
                    <table className="govuk-table">
                        <thead className="govuk-table__head">
                            <tr className="govuk-table__row">
                                <th className="govuk-table__header" scope="col">Team members</th>
                                <th className="govuk-table__header" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="govuk-table__body">
                            {
                                state.teamMembers.map((teamMember) => {
                                    return (
                                        <tr className="govuk-table__row" key={teamMember.value}>
                                            <td className="govuk-table__cell">{teamMember.label}</td>
                                            <td className="govuk-table__cell">
                                                <a href="#"
                                                    onClick={event => removeTeamMember(teamMember.value, teamId as string, event)}>Remove</a>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                )}
            </Fragment>
        );

        return (
            <div className="govuk-form-group">
                <Link to="/team-search" className="govuk-back-link">Back</Link>
                <ErrorSummary
                    pageError={pageError}
                />
                <div>
                    <h1 className="govuk-heading-xl">Manage Team</h1>
                    <h2 className="govuk-heading-l">
                        <span
                            className={!state.active ? 'govuk-grid-column-three-quarters' : ''}>{`Team: ${state.teamName}`}</span>
                        <span>{!state.active && <strong className="govuk-tag govuk-tag--grey">Inactive</strong>}</span>

                    </h2>
                    {!state.active && <p className={'govuk-inset-text'}>
                        <p className={'govuk-heading-s'}>
                            This team is inactive
                        </p>
                        <p>
                            New cases cannot be assigned to {state.teamName}. You can still assign members to this team
                            to
                            view and process existing cases.


                        </p>
                        <p>
                            {hasRole('ACTIVATE_TEAM') &&
                            <Link to={`/team/${teamId}/reactivate`} type="submit"
                                className="govuk-link">Reactivate team</Link>}
                        </p>
                    </p>}

                    <h2 className="govuk-heading-m govuk">
                        {`Unit: ${state.unitName}`}
                    </h2>
                    <h3 className="govuk-heading-l">View and remove team members</h3>

                    {
                        state.teamMembersLoaded ?
                            <div>
                                <DisplayTeamTable/>
                            </div> :
                            <div>
                                <p className="govuk-body">Loading...</p>
                            </div>
                    }
                    <button type="submit" className="govuk-button govuk-!-margin-right-1 add-team-members-button"
                        data-module="govuk-button"
                        onClick={() => onAddTeamMembersAddClick(history, teamId as string)}>Add team members
                    </button>
                    <button type="submit"
                        className="govuk-button govuk-!-margin-right-1 govuk-button--secondary manage-nominated-contacts-button"
                        data-module="govuk-button"
                        onClick={() => onAddNominatedContactClick(history, teamId as string)}>Manage nominated
                        contacts
                    </button>
                    {hasOneOfRoles(['RENAME_TEAM', 'REASSIGN_TEAM_UNIT']) &&
                    <button type="submit" className="govuk-button govuk-button--secondary govuk-!-margin-right-1"
                        data-module="govuk-button" onClick={() => onEditTeamAddClick(history, teamId)}>Edit
                        Team</button>}
                    {(state.active && hasRole('DEACTIVATE_TEAM'))
                    && <button onClick={() => onDeactivateTeamAddClick(history, teamId)} type="submit"
                        className="govuk-button govuk-button--secondary">Deactivate team</button>}
                    {(!state.active && hasRole('ACTIVATE_TEAM'))
                    && <button onClick={() => onReactivateTeamAddClick(history, teamId)} type="submit"
                        className="govuk-button govuk-button--secondary">Reactivate team</button>}
                </div>
            </div>
        );
    };

const WrappedTeamView = (routeProps: RouteComponentProps<MatchParams>) => (
    <ApplicationConsumer>
        {
            ({ hasOneOfRoles, hasRole }: ApplicationState) => {
                return <TeamView {...routeProps} hasOneOfRoles={hasOneOfRoles} hasRole={hasRole}/>;
            }
        }
    </ApplicationConsumer>
);

export default WrappedTeamView;

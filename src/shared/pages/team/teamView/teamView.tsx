import React, { Reducer, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import { deleteUserFromTeam } from '../../../services/usersService';
import { getTeam, getTeamMembers } from '../../../services/teamsService';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { ListUser } from '../../../models/listUser';
import { GENERAL_ERROR_TITLE, LOAD_TEAM_ERROR_DESCRIPTION, LOAD_TEAM_MEMBERS_ERROR_DESCRIPTION, REMOVE_FROM_TEAM_ERROR_DESCRIPTION, VALIDATION_ERROR_TITLE, REMOVE_FROM_TEAM_ALLOCATED_ERROR_DESCRIPTION } from '../../../models/constants';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import { ApplicationConsumer, ApplicationState } from '../../../contexts/application';

interface MatchParams {
    teamId: string;
}

interface TeamMembersProps extends RouteComponentProps<MatchParams> {
    hasRole: (role: string) => boolean;
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

const TeamView: React.FC<TeamMembersProps> = ({ history, match, hasRole }) => {
    const [pageError, , clearErrors, setErrorMessage] = useError();
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    const { params: { teamId } } = match;

    useEffect(() => {
        getTeam(teamId)
            .then(team => dispatch({ type: 'SetTeamName', payload: team.displayName }))
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
                                            <a href="#" onClick={event => removeTeamMember(teamMember.value, teamId as string, event)}>Remove</a>
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
                <h1 className="govuk-heading-xl">View and remove team members</h1>
                <h2 className="govuk-heading-l">
                    {`Team: ${state.teamName}`}
                </h2>
                {
                    state.teamMembersLoaded ?
                        <div>
                            <DisplayTeamTable />
                        </div> :
                        <div>
                            <p className="govuk-body">Loading...</p>
                        </div>
                }
                <button type="submit" className="govuk-button govuk-!-margin-right-1 add-team-members-button" data-module="govuk-button" onClick={() => onAddTeamMembersAddClick(history, teamId as string)}>Add team members</button>
                <button type="submit" className="govuk-button govuk-!-margin-right-1 govuk-button--secondary manage-nominated-contacts-button" data-module="govuk-button" onClick={() => onAddNominatedContactClick(history, teamId as string)}>Manage nominated contacts</button>
                {hasRole('RENAME_TEAM') &&
                    <button type="submit" className="govuk-button govuk-button--secondary" data-module="govuk-button" onClick={() => onEditTeamAddClick(history, teamId)}>Edit Team</button>}
            </div>
        </div>
    );
};

const WrappedTeamView = (routeProps: RouteComponentProps<MatchParams>) => (
    <ApplicationConsumer>
        {
            ({ hasRole }: ApplicationState) => {
                return <TeamView {...routeProps} hasRole={hasRole} />;
            }
        }
    </ApplicationConsumer>
);

export default WrappedTeamView;

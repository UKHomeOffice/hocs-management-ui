import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import { getTeamsForUser } from '../../../services/teamsService';
import Item from '../../../models/item';
import { deleteUserFromTeam, getUser } from '../../../services/usersService';
import { GENERAL_ERROR_TITLE, LOAD_TEAMS_ERROR_DESCRIPTION, LOAD_USER_ERROR_DESCRIPTION, REMOVE_FROM_TEAM_ALLOCATED_ERROR_DESCRIPTION, REMOVE_FROM_TEAM_ERROR_DESCRIPTION, VALIDATION_ERROR_TITLE } from '../../../models/constants';
import { User } from '../../../models/user';
import Text from '../../../common/components/forms/text';

interface UserDetailsProps {
    user?: User;
}

interface UserTeamsProps {
    teams?: Item[];
}

interface MatchParams {
    userId: string;
}

type UserMembersProps = RouteComponentProps<MatchParams>;

const onAddUsersAddClick = (history: History, userId: string) => {
    history.push(`/user/${userId}/add-teams`);
};

const UserView: React.FC<UserMembersProps> = ({ history, match }) => {

    const [pageError, , clearErrors, setErrorMessage] = useError();
    const { params: { userId } } = match;
    const [user, setUser] = React.useState<User>();
    const [teams, setTeams] = React.useState<Item[] | undefined>(undefined);

    useEffect(() => {
        getTeamsForUser(userId)
            .then((loadedTeams) => {
                setTeams(loadedTeams);
            })
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAMS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });

        getUser(userId)
            .then(loadedUser => setUser(loadedUser))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_USER_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const removeTeamFromUser = (teamId: string, event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        deleteUserFromTeam(userId, teamId)
            .then(() => {
                getTeamsForUser(userId)
                    .then((newTeams) => {
                        setTeams(newTeams);
                    })
                    .catch(() => {
                        setErrorMessage(new ErrorMessage(LOAD_TEAMS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
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

    const runAmendUser = (userUuid: string, event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        history.push(`/user/${userUuid}/amend`);
    };

    const UserDetails: React.FC<UserDetailsProps> = () => (
        user ?
            <form>
                { !user.enabled && <p><strong className="govuk-tag govuk-tag--grey">Disabled</strong></p> }
                <Text
                    label="Username"
                    name="username"
                    disabled
                    type="text"
                    updateState={() => {}}
                    value={user.username}
                />
                <Text
                    label="Email Address"
                    name="email"
                    disabled
                    type="text"
                    updateState={() => {}}
                    value={user.email}
                />
                <Text
                    label="First Name"
                    name="firstName"
                    disabled
                    type="text"
                    updateState={() => {}}
                    value={user.firstName}
                />
                <Text
                    label="Last Name"
                    name="lastName"
                    disabled
                    type="text"
                    updateState={() => {}}
                    value={user.lastName}
                />
            </form>
            :
            <p className="govuk-body">Details Loading...</p>
    );

    const UserTeams: React.FC<UserTeamsProps> = () => (
        teams != undefined ?
            <table className="govuk-table">
                <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                        <th className="govuk-table__header" scope="col">Teams</th>
                        <th className="govuk-table__header" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody className="govuk-table__body">
                    {
                        teams.map((team: Item) => {
                            return (
                                <tr className="govuk-table__row" key={team.value}>
                                    <td className="govuk-table__cell">{team.label}</td>
                                    <td className="govuk-table__cell">
                                        <a href="#" onClick={event => removeTeamFromUser(team.value, event)}>Remove</a>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            :
            <p className="govuk-body">Teams Loading...</p>
    );

    return (
        <div className="govuk-form-group">
            <Link to="/user-search" className="govuk-back-link">Back</Link>
            <ErrorSummary pageError={pageError}/>
            <div>
                <h1 className="govuk-heading-xl">Manage User</h1>
                <UserDetails user={user} />
                <div className="govuk-!-padding-top-5">
                    <button
                        type="submit"
                        className="govuk-button govuk-!-margin-right-1"
                        data-module="govuk-button"
                        name="amend-details-button"
                        role="link"
                        onClick={event => runAmendUser(userId, event)}
                    >
                        Amend Details
                    </button>
                </div>
                <UserTeams teams={teams}/>
                <button
                    type="submit"
                    className="govuk-button govuk-!-margin-right-1 add-user-members-button"
                    data-module="govuk-button"
                    name="add-teams-button"
                    role="link"
                    onClick={() => onAddUsersAddClick(history, userId)}
                >
                    Add teams
                </button>
            </div>
        </div>
    );
};

export default UserView;

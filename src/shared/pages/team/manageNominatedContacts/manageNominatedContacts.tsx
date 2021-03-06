import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import ErrorSummary from '../../../common/components/errorSummary';
import {
    EMAIL_VALIDATION_ERROR_TITLE,
    GENERAL_ERROR_TITLE,
    LOAD_TEAM_ERROR_DESCRIPTION
} from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import { getTeam } from '../../../services/teamsService';
import AddNominatedContact from './addNominatedContacts';
import NominatedContactList from './nominatedContactList';
import Team from '../../../models/team';
import { ContactsProvider } from './contactsContext';

interface MatchParams {
    teamId: string;
}

const ManageNominatedContacts: React.FC<RouteComponentProps<MatchParams>> = ({ history, match }) => {
    const errorFuncs = useError('', EMAIL_VALIDATION_ERROR_TITLE);
    const [pageError, , , setErrorMessage] = errorFuncs;

    const [team, setTeam] = useState<Team>( {} as Team);
    const { params: { teamId } } = match;

    useEffect(() => {
        getTeam(teamId)
            .then(team => setTeam(team))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link className="govuk-back-link" to={`/team-view/${teamId}`}>Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Manage nominated contacts
                    </h1>
                    <h2 className="govuk-heading-l">
                        {`Team: ${team.displayName}`}
                    </h2>
                </div>
            </div>
            <ContactsProvider>
                <AddNominatedContact teamId={teamId} errorFuncs={errorFuncs}/>
                <NominatedContactList teamId={teamId} errorFuncs={errorFuncs}/>
            </ContactsProvider>
        </>
    );
};

export default ManageNominatedContacts;

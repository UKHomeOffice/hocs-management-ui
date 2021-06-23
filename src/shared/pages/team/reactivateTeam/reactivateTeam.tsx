import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { getTeam, updateTeam } from '../../../services/teamsService';
import ErrorMessage from '../../../models/errorMessage';
import {
    GENERAL_ERROR_TITLE,
    LOAD_TEAM_ERROR_DESCRIPTION,
    TEAM_UPDATE_FAILED_UNKNOWN_ERROR
} from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorSummary from '../../../common/components/errorSummary';


interface MatchParams {
    teamId: string;
}

type ReactivateTeamProps = RouteComponentProps<MatchParams>;

const ReactivateTeam: React.FC<ReactivateTeamProps> = ({  history, match }) => {
    const { params: { teamId } } = match;

    const [pageError, , , setErrorMessage] = useError();
    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        getTeam(teamId)
            .then(team => {
                setTeamName(team.displayName);
            })
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const reactivateTeam = async () => {
        await updateTeam(teamId, { active: true }).then(() => {
            history.push(`/team-view/${teamId}`,
                { successMessage: `${teamName} has been reactivated successfully` });
        }).catch((error) => {
            setErrorMessage(
                new ErrorMessage(error.response.data.body || TEAM_UPDATE_FAILED_UNKNOWN_ERROR, GENERAL_ERROR_TITLE)
            );
        });
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
                        Reactivating team
                    </h1>
                    <div className="govuk-body">
                        You are reactivating the <strong>{teamName}</strong> team.
                    </div>
                    <div className="govuk-form-group">
                        <button type="submit" className="govuk-button govuk-!-margin-right-1" onClick={reactivateTeam}>Reactivate Team</button>
                        <Link to={`/team-view/${teamId}`} className="govuk-button govuk-button--secondary">Cancel</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReactivateTeam;

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

type DeactivateTeamProps = RouteComponentProps<MatchParams>;

const DeactivateTeam: React.FC<DeactivateTeamProps> = ({ history, match }) => {
    const { params: { teamId } } = match;

    const [pageError, , , setErrorMessage] = useError();
    const [teamName, setTeamName] = useState('');

    const deactivateTeam = async () => {
        await updateTeam(teamId, { active: false }).then(() => {
            history.push(`/team-view/${teamId}`,
                { successMessage: `${teamName} has been deactivated successfully` });
        }).catch((error) => {
            setErrorMessage(
                new ErrorMessage(error.response.data.body || TEAM_UPDATE_FAILED_UNKNOWN_ERROR, GENERAL_ERROR_TITLE)
            );
        });
    };

    useEffect(() => {
        getTeam(teamId)
            .then(team => {
                setTeamName(team.displayName);
            })
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to={`/team-view/${teamId}`} className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Deactivating team
                    </h1>
                    <div className="govuk-body">
                        <p>You are deactivating the <strong>{teamName}</strong> team.</p>

                        <p>New cases won&rsquo;t be assigned to it, but existing cases are unaffected</p>

                        <p>This means:</p>
                        <ul>
                            <li>cases already with this team will stay with the team</li>
                            <li>existing cases with this team can still be worked</li>
                            <li>this team&apos;s topics will remain active but without a recommended team</li>
                            <li>the team will no longer appear in drop-downs</li>
                            <li>caseworkers will be prevented from giving new cases to the team</li>
                            <li>in-flight cases that passed through this team can still be returned to it</li>
                            <li>caseworkers will remain part of the team</li>
                        </ul>

                        <p>In an emergency, cases might be routed to the DCU central team.</p>

                        <p>You can reactivate at any time.</p>
                    </div>
                    <div className="govuk-form-group">
                        <button type="submit" className="govuk-button govuk-!-margin-right-1" onClick={deactivateTeam}>Deactivate Team</button>
                        <Link to={`/team-view/${teamId}`} className="govuk-button govuk-button--secondary">Cancel</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeactivateTeam;

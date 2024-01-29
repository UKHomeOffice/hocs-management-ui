import React, { useCallback, useEffect } from 'react';
import TypeAhead from '../../../common/components/typeAhead';
import { getAllTeams, getTeams } from '../../../services/teamsService';
import { History } from 'history';
import Item from '../../../models/item';
import ErrorSummary from '../../../common/components/errorSummary';
import { GENERAL_ERROR_TITLE, LOAD_TEAMS_ERROR_DESCRIPTION, EMPTY_SUBMIT_TEAM_ERROR_DESCRIPTION, EMPTY_SUBMIT_TEAM_ERROR_TITLE } from '../../../models/constants';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import Checkbox from '../../../common/components/forms/checkbox';

interface TeamSearchProps {
    history: History;
}

const TeamSearch: React.FC<TeamSearchProps> = ({ history }) => {

    const [pageError, , clearErrors, setErrorMessage] = useError();
    const [selectedTeam, setSelectedTeam] = React.useState<Item>();
    const [showInactive, setShowInactive] = React.useState<boolean>(false);
    const [teamsListLabel, setTeamsListLabel] = React.useState<string>('Teams');

    const handleOnSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        clearErrors();
        if (selectedTeam) {
            history.push(`/team-view/${selectedTeam!.value}`);
            return;
        }
        setErrorMessage(new ErrorMessage(EMPTY_SUBMIT_TEAM_ERROR_DESCRIPTION, EMPTY_SUBMIT_TEAM_ERROR_TITLE));
    };

    useEffect(() => {
        if(!showInactive) {
            setTeamsListLabel('Teams');
        } else {
            setTeamsListLabel('Teams (Including Inactive)');
        }
    }, [showInactive]);


    const getTeamsForTypeahead = useCallback((teamsProvider: () => Promise<Item[]>) => () => new Promise<Item[]>(
        resolve => teamsProvider()
            .then((teams: Item[]) => resolve(teams))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_TEAMS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                resolve([]);
            })), []);

    return (
        <div className="govuk-form-group">
            <Link className="govuk-back-link" to="/">Back</Link>
            <ErrorSummary pageError={pageError} />
            <h1 className="govuk-heading-xl">
                Team search
            </h1>
            <div className="govuk-grid-row">
                {!showInactive && <div className="govuk-grid-column-three-quarters"><TypeAhead
                    clearable={true}
                    disabled={false}
                    getOptions={getTeamsForTypeahead(getTeams)}
                    label={teamsListLabel}
                    name={'Teams'}
                    onSelectedItemChange={setSelectedTeam}
                /></div>}
                {showInactive && <div className="govuk-grid-column-three-quarters"><TypeAhead
                    clearable={true}
                    disabled={false}
                    getOptions={getTeamsForTypeahead(getAllTeams)}
                    label={teamsListLabel}
                    name={'Teams'}
                    onSelectedItemChange={setSelectedTeam}
                /></div>}
                <div className="govuk-grid-column-one-quarter">
                    <Checkbox label="Show Deactivated Teams" name="showDeactivated" updateState={(val) => setShowInactive(val.value === 'true')} value={showInactive.toString()} />
                </div>
            </div>
            <button type="submit" className="govuk-button view-team-button" onClick={handleOnSubmit}>View team</button>
        </div>
    );
};

export default TeamSearch;

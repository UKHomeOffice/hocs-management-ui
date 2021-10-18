import React, { Reducer, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import { getListItems } from '../../../services/entityListService';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import {
    GENERAL_ERROR_TITLE,
    LOAD_FOI_ACCOUNT_MANAGERS_ERROR_DESCRIPTION
} from '../../../models/constants';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import EntityListItem from '../../../models/entityListItem';

interface MatchParams {
    teamId: string;
}

type TeamMembersProps = RouteComponentProps<MatchParams>;

const onAddClick = (history: History) => {
    history.push('/manage-foi-account-managers/add');
};

const FoiAccountManagersView: React.FC<TeamMembersProps> = ({ history, match }) => {

    const [pageError, , clearErrors, setErrorMessage] = useError();
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    useEffect(() => {
        getListItems('FOI_ACCOUNT_MANAGERS')
            .then((accountManagers: EntityListItem[]) => dispatch({ type: 'PopulateAccountManagers', payload: accountManagers }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_FOI_ACCOUNT_MANAGERS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const amendAccountManager = (managerUuid: string, event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        history.push(`/manage-foi-account-managers/${managerUuid}/amend`);

    };

    const DisplayCampaignTable = () => (
        <Fragment>
            {state.accountManagersLoaded && (
                <table className="govuk-table">
                    <thead className="govuk-table__head">
                        <tr className="govuk-table__row">
                            <th className="govuk-table__header" scope="col">Account manager name</th>
                            <th className="govuk-table__header" scope="col">Account manager code</th>
                            <th className="govuk-table__header" scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className="govuk-table__body">
                        {
                            state.accountManagers.map((accountManager) => {
                                return (
                                    <tr className="govuk-table__row" key={accountManager.uuid}>
                                        <td className="govuk-table__cell">{accountManager.title}</td>
                                        <td className="govuk-table__cell">{accountManager.simpleName}</td>
                                        <td className="govuk-table__cell">
                                            <a href="#" onClick={event => amendAccountManager(accountManager.uuid, event)}>Amend</a>
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
            <Link to="/" className="govuk-back-link">Back</Link>
            <ErrorSummary
                pageError={pageError}
            />
            <div>
                <h1 className="govuk-heading-xl">View and edit account managers</h1>
                {
                    state.accountManagersLoaded ?
                        <div>
                            <DisplayCampaignTable />
                        </div> :
                        <div>
                            <p className="govuk-body">Loading...</p>
                        </div>
                }
                <button type="submit" className="govuk-button govuk-!-margin-right-1 add-team-members-button" data-module="govuk-button" onClick={() => onAddClick(history)}>Add new account manager</button>
            </div>
        </div>
    );
};

export default FoiAccountManagersView;

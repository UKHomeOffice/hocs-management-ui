import React, { Reducer, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import { deleteListItem, getListItems } from '../../../services/entityListService';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { GENERAL_ERROR_TITLE, ADD_EXGRATIA_BUS_REP_DELETE_SUCCESS, ADD_EXGRATIA_BUS_REP_DELETE_ERROR_DESCRIPTION, LOAD_REPRESENTATIVES_ERROR_DESCRIPTION } from '../../../models/constants';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import EntityListItem from 'shared/models/entityListItem';

interface MatchParams {
    teamId: string;
}

type TeamMembersProps = RouteComponentProps<MatchParams>;

const onAddClick = (history: History) => {
    history.push('/manage-exgratia-reps/add');
};

const ExGratiaView: React.FC<TeamMembersProps> = ({ history, match }) => {
    const [pageError, , clearErrors, setErrorMessage] = useError();
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    useEffect(() => {
        getListItems('EXGRATIA_BUS_REPS')
            .then((representatives: EntityListItem[]) => dispatch({ type: 'PopulateRepresentatives', payload: representatives }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_REPRESENTATIVES_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const deleteRepresentative = (representativeUUID: string, event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        deleteListItem(representativeUUID, 'EXGRATIA_BUS_REPS').then(() => {
            history.push('/', { successMessage: ADD_EXGRATIA_BUS_REP_DELETE_SUCCESS });
        }).catch(() => {
            setErrorMessage(new ErrorMessage(ADD_EXGRATIA_BUS_REP_DELETE_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
        });
    };

    const DisplayRepresentativesTable = () => (
        <Fragment>
            {state.representativesLoaded && (
                <table className="govuk-table">
                    <thead className="govuk-table__head">
                        <tr className="govuk-table__row">
                            <th className="govuk-table__header" scope="col">Business Representative Name</th>
                            <th className="govuk-table__header" scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className="govuk-table__body">
                        {
                            state.representatives.map((representative) => {
                                return (
                                    <tr className="govuk-table__row" key={representative.uuid}>
                                        <td className="govuk-table__cell">{representative.title}</td>

                                        <td className="govuk-table__cell">
                                            <a href="#" onClick={event => deleteRepresentative(representative.uuid, event)}>Delete</a>
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
                <h1 className="govuk-heading-xl">View and edit Ex-Gratia Business Representatives</h1>
                {
                    state.representativesLoaded ?
                        <div>
                            <DisplayRepresentativesTable />
                        </div> :
                        <div>
                            <p className="govuk-body">Loading...</p>
                        </div>
                }
                <button type="submit" className="govuk-button govuk-!-margin-right-1 add-team-members-button" data-module="govuk-button" onClick={() => onAddClick(history)}>Add new representative</button>
            </div>
        </div>
    );
};

export default ExGratiaView;

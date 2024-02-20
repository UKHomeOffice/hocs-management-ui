import React, { Reducer, useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import * as constants from '../../../models/constants';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import CaseType from 'shared/models/caseType';
import { getListItems } from '../../../services/entityListService';
import { listNames } from './listNames';
import { State } from '../entityList/state';
import { Action } from '../entityList/actions';
import { reducer } from '../entityList/reducer';
import { initialState } from '../entityList/initialState';
import { ShowInactiveItemsToggle } from '../entityList/showInactiveItemsToggle';

interface MatchParams {
    type: string;
}

type CasesProps = RouteComponentProps<MatchParams>;

const onAddBusinessUnitClick = (history: History, type: string) => {
    history.push(`/add-business-unit/${type}`);
};

const onAmendBusinessUnitClick = (history: History, uuid: string, type: string) => {
    history.push(`/amend-business-unit/${type}/${uuid}`);
};

const BusinessAreaView: React.FC<CasesProps> = ({ history, match }) => {


    const [pageError, , , setErrorMessage] = useError();
    const [caseType] = React.useState<CaseType>();

    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);
    const businessAreas = state.entitiesToDisplay;

    const { params: { type } } = match;
    const readableType = listNames[type];

    useEffect(() => {
        getListItems(type)
            .then(payload => dispatch({ type: 'PopulateEntities', payload }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(constants.LOAD_BUS_AREA_ERROR_DESCRIPTION, constants.GENERAL_ERROR_TITLE));
            });
    }, []);

    const toggleShowInactive = useCallback(
        (showInactive: boolean) => dispatch({ type: 'ToggleShowInactive', payload: showInactive }), [dispatch]
    );

    return (
        <div className="govuk-form-group">
            <Link to="/select-business-area" className="govuk-back-link">Back</Link>
            <ErrorSummary
                pageError={pageError}
            />
            <div>
                <h1 className="govuk-heading-xl">View and Edit Business Units for {readableType}</h1>
                {caseType && <h2 className="govuk-heading-l">
                    {`Business Area: ${caseType.displayName}`}
                </h2>}
                {
                    businessAreas && businessAreas.length > 0 ?
                        <div>
                            <ShowInactiveItemsToggle
                                inactiveCount={state.inactiveCount}
                                showInactive={state.showInactive}
                                onToggle={toggleShowInactive}
                            />
                            <table className="govuk-table">
                                <thead className="govuk-table__head">
                                    <tr className="govuk-table__row">
                                        <th className="govuk-table__header" scope="col">Business Unit</th>
                                        {state.showInactive && <th className="govuk-table__header" scope="col">Active?</th>}
                                        <th className="govuk-table__header" scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="govuk-table__body">
                                    {
                                        businessAreas.map((businessArea) => {
                                            return (
                                                <tr className="govuk-table__row" key={businessArea.simpleName}>
                                                    <td className="govuk-table__cell">{businessArea.title}</td>
                                                    {state.showInactive && <td className="govuk-table__cell" scope="col">{businessArea.active ? 'Yes' : 'No'}</td>}
                                                    <td className="govuk-table__cell">
                                                        <a href="#" onClick={event => onAmendBusinessUnitClick(history, businessArea.uuid, type)}>Amend</a>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div> :
                        <div>
                            <p className="govuk-body">Loading...</p>
                        </div>
                }
                <button
                    type="submit"
                    className="govuk-button govuk-!-margin-right-1 add-team-members-button"
                    data-module="govuk-button"
                    name="add-business-unit-button"
                    role="link"
                    onClick={() => onAddBusinessUnitClick(history, type)}
                >
                    Add Business Unit
                </button>
            </div>
        </div>
    );
};

export default BusinessAreaView;

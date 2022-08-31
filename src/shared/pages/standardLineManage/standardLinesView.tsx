import React, { Reducer, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import { getAllStandardLines, expireStandardLine, deleteStandardLine } from '../../services/standardLinesService';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import Text from '../../common/components/forms/text';
import { GENERAL_ERROR_TITLE, LOAD_STANDARD_LINES_ERROR_DESCRIPTION, EXPIRE_STANDARD_LINE_ERROR_DESCRIPTION, DELETE_STANDARD_LINE_ERROR_DESCRIPTION } from '../../models/constants';
import ErrorSummary from '../../common/components/errorSummary';
import ErrorMessage from '../../models/errorMessage';
import useError from '../../hooks/useError';
import { Link } from 'react-router-dom';
import StandardLineModel from '../../models/standardLineModel';
import InputEventData from 'shared/models/inputEventData';

interface MatchParams {
    teamId: string;
}

type StandardLinesProps = RouteComponentProps<MatchParams>;

const onAddClick = (history: History) => {
    history.push('/add-standard-line');
};

const StandardLinesView: React.FC<StandardLinesProps> = ({ history, match }) => {

    const [pageError, , clearErrors, setErrorMessage] = useError();
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    useEffect(() => refreshPage(), []);

    const refreshPage = () => {
        getAllStandardLines()
            .then((standardLines: StandardLineModel[]) => dispatch({ type: 'PopulateStandardLines', payload: standardLines }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_STANDARD_LINES_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    };

    const runAmendStandardLine = (standardLineUuid: string, event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        history.push(`/manage-standard-lines/${standardLineUuid}/amend`);

    };

    const runDeleteStandardLine = (standardLineUuid: string, event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        deleteStandardLine(standardLineUuid).then(() => refreshPage()).catch(() => {
            setErrorMessage(new ErrorMessage(DELETE_STANDARD_LINE_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
        });
    };

    const runExpireStandardLine = (standardLineUuid: string, event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        expireStandardLine(standardLineUuid).then(() => refreshPage()).catch(() => {
            setErrorMessage(new ErrorMessage(EXPIRE_STANDARD_LINE_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
        });

    };

    const renderFilter = () => {
        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-third">
                    <div className="govuk-form-group filter-row">
                        <Text
                            label="Filter"
                            name="filter"
                            type="text"
                            updateState={(inputEventData: InputEventData) => dispatch({ type: 'FilterStandardLines', payload: inputEventData.value as string })}
                            value={state.filter}
                            autoFocus={true}
                        />
                        <div className="govuk-hint" aria-live="polite">
                            {state.activeStandardLines.length} Items
                        </div>
                    </div>
                    <div className="govuk-grid-row margin-bottom--small">
                        <div className="govuk-grid-column-two-thirds govuk-label--s padding-top--small">Exclude expired</div>
                        <div className="govuk-grid-column-one-third bigger">
                            <input
                                name="excludeExpired"
                                type="checkbox"
                                checked={state.excludeExpired}
                                onChange={event => dispatch({ type: 'ExcludeExpiredCheckTrigger', payload: event.target.checked })} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DisplayStandardLinesTable = () => (
        <Fragment>
            {state.standardLinesLoaded && renderFilter()}
            {state.standardLinesLoaded && (
                <div className="scrollableTable">

                    < table className="govuk-table">
                        <thead className="govuk-table__head">
                            <tr className="govuk-table__row">
                                <th className="govuk-table__header" scope="col">Topic</th>
                                <th className="govuk-table__header" scope="col">Team</th>
                                <th className="govuk-table__header" scope="col">Filename</th>
                                <th className="govuk-table__header" scope="col">Expiry date</th>
                                <th className="govuk-table__header" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="govuk-table__body">
                            {
                                state.activeStandardLines.map((standardLine) => {
                                    return (
                                        <tr className="govuk-table__row" key={standardLine.uuid}>
                                            <td className="govuk-table__cell">{standardLine.topic}</td>
                                            <td className="govuk-table__cell">{standardLine.team}</td>
                                            <td className="govuk-table__cell">{standardLine.displayName}</td>
                                            {renderExpiryDateCell(standardLine)}
                                            <td className="govuk-table__cell govuk-!-width-one-quarter">
                                                <span>
                                                    <a href={`/api/standard-lines/download/${standardLine.documentUUID}`} className="govuk-link">Download</a>{' | '}
                                                    <a href="#" onClick={event => runAmendStandardLine(standardLine.uuid, event)} className="govuk-link">Amend</a>{' | '}
                                                    <a href="#" onClick={event => runExpireStandardLine(standardLine.uuid, event)} className="govuk-link">Expire</a>{' | '}
                                                    <a href="#" onClick={event => runDeleteStandardLine(standardLine.uuid, event)} className="govuk-link">Delete</a>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )
            }
        </Fragment >
    );

    const renderExpiryDateCell = (standardLine: StandardLineModel) => {
        if (standardLine.isExpired) {
            return <td className="govuk-table__cell date-warning"> <span>{standardLine.expiryDate}</span></td>;
        }
        return <td className="govuk-table__cell date-standard"><span>{standardLine.expiryDate}</span></td>;
    };

    return (
        <div className="govuk-form-group">
            <Link to="/" className="govuk-back-link">Back</Link>
            <ErrorSummary
                pageError={pageError}
            />
            <div>
                <h1 className="govuk-heading-xl">View and update standard lines</h1>
                {
                    state.standardLinesLoaded ?
                        <div>
                            <DisplayStandardLinesTable />
                        </div> :
                        <div>
                            <p className="govuk-body">Loading...</p>
                        </div>
                }
                <br />
                <button type="submit" className="govuk-button govuk-!-margin-right-1 " data-module="govuk-button" onClick={() => onAddClick(history)}>Add new standard line</button>
            </div>
        </div>
    );
};

export default StandardLinesView;

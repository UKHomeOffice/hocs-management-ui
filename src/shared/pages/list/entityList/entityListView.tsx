import React, { Fragment, Reducer, useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import { getListItems } from '../../../services/entityListService';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import { GENERAL_ERROR_TITLE } from '../../../models/constants';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import EntityListItem from '../../../models/entityListItem';
import { ShowInactiveItemsToggle } from './showInactiveItemsToggle';

interface MatchParams {
    teamId: string;
}

type EntityListViewProps = RouteComponentProps<MatchParams>;


const EntityListView = (entityDefinition: EntityDefinition) => {
    const onAddClick = (history: History) => {
        history.push(`${entityDefinition.entityRoute}/add`);
    };

    const EntityListView: React.FC<EntityListViewProps> = ( { history } ) => {

        const [pageError, , clearErrors, setErrorMessage] = useError();
        const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

        useEffect(() => {
            getListItems(entityDefinition.entityListName)
                .then((entities: EntityListItem[]) => dispatch({ type: 'PopulateEntities', payload: entities }))
                .catch(() => {
                    setErrorMessage(new ErrorMessage(entityDefinition.messages.LOAD_ENTITIES_ERROR,
                        GENERAL_ERROR_TITLE));
                });
        }, []);

        const amendEntity = useCallback((entityUuid: string, event: React.FormEvent) => {
            event.preventDefault();
            clearErrors();
            history.push(`${entityDefinition.entityRoute}/${entityUuid}/amend`);
        }, []);

        const toggleShowInactive = useCallback(
            (showInactive: boolean) => dispatch({ type: 'ToggleShowInactive', payload: showInactive }), [dispatch]
        );

        const DisplayCampaignTable = () => (
            <Fragment>
                {state.entitiesLoaded && (<>
                    <ShowInactiveItemsToggle showInactive={state.showInactive} inactiveCount={state.inactiveCount} onToggle={toggleShowInactive}/>
                    <table className="govuk-table">
                        <thead className="govuk-table__head">
                            <tr className="govuk-table__row">
                                <th className="govuk-table__header" scope="col">{`${entityDefinition.entityNameCapitalised} name`}</th>
                                <th className="govuk-table__header" scope="col">{`${entityDefinition.entityNameCapitalised} code`}</th>
                                {state.showInactive && <th className="govuk-table__header" scope="col">Active?</th>}
                                <th className="govuk-table__header" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="govuk-table__body">
                            {
                                state.entitiesToDisplay.map((entity) => {
                                    return (
                                        <tr className={`govuk-table__row${entity.active ? '' : ' inactive-entity'}`} key={entity.uuid}>
                                            <td className="govuk-table__cell">{entity.title}</td>
                                            <td className="govuk-table__cell">{entity.simpleName}</td>
                                            {state.showInactive && <td className="govuk-table__cell" scope="col">{entity.active ? 'Yes' : 'No'}</td>}
                                            <td className="govuk-table__cell">
                                                <a href="#" onClick={event => amendEntity(entity.uuid, event)}>Amend</a>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </>)}
            </Fragment>
        );

        return (
            <div className="govuk-form-group">
                <Link to="/" className="govuk-back-link">Back</Link>
                <ErrorSummary
                    pageError={pageError}
                />
                <div>
                    <h1 className="govuk-heading-xl">{`View and edit ${entityDefinition.entityNamePlural}`}</h1>
                    {
                        state.entitiesLoaded ?
                            <div>
                                <DisplayCampaignTable />
                            </div> :
                            <div>
                                <p className="govuk-body">Loading...</p>
                            </div>
                    }
                    <button type="submit" className="govuk-button govuk-!-margin-right-1 add-team-members-button" data-module="govuk-button" onClick={() => onAddClick(history)}>{`Add new ${entityDefinition.entityName}`}</button>
                </div>
            </div>
        );
    };

    return EntityListView;
};

export default EntityListView;

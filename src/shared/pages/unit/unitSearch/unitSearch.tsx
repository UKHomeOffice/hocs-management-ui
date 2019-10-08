import React, { useEffect, Reducer } from 'react';
import TypeAhead from '../../../common/components/typeAhead';
import { getUnits } from '../../../services/unitsService';
import { History } from 'history';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import Item from '../../../models/item';
import ErrorSummary from '../../../common/components/errorSummary';
import { GENERAL_ERROR_TITLE, LOAD_TEAMS_ERROR_DESCRIPTION } from '../../../models/constants';

interface UnitSearchProps {
    history: History;
}

const UnitSearch: React.FC<UnitSearchProps> = ({ history }) => {

    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    useEffect(() => {
        getUnits()
            .then((units: Item[]) => { dispatch({ type: 'SetUnits', payload: units }); })
            .catch(() => {
                dispatch({ type: 'SetGeneralError', payload: { description: LOAD_TEAMS_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE }
                });
            });
    }, []);

    const onSelectedTeamChange = (selectedUnit: any) => {
        dispatch({ type: 'AddUnitUUID', payload: selectedUnit.value });

    };

    const handleOnSubmit = () => {
        history.push(`/unit/${state.unitUUID}`);
    };

    const onBackLinkClick = (history: History) => {
        history.push('/');
    };

    return (
        <div className="govuk-form-group">
            <a href="" onClick={() => onBackLinkClick(history)} className="govuk-back-link">Back</a>
            <ErrorSummary
                heading={state.errorTitle}
                description={state.errorDescription}
            />
            <h1 className="govuk-heading-xl">
                Team search
            </h1>
            {
                state.unitsLoaded ?
                <div>
                    <TypeAhead
                        choices={state.units}
                        clearable={true}
                        disabled={false}
                        label={'Units'}
                        name={'Units'}
                        onSelectedItemChange={onSelectedTeamChange}
                    ></TypeAhead>
                </div> :
                <div>
                    ...loading
                </div>
            }

            <button type="submit" className="govuk-button view-team-button" onClick={() => { handleOnSubmit(); }}>View unit</button>
        </div>
    );
};

export default UnitSearch;

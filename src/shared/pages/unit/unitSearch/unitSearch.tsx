import React, { Reducer, useCallback } from 'react';
import TypeAhead from '../../../common/components/typeAhead';
import { History } from 'history';
import { State } from './state';
import { Action } from './actions';
import { reducer } from './reducer';
import { initialState } from './initialState';
import Item from '../../../models/item';
import ErrorSummary from '../../../common/components/errorSummary';
import { GENERAL_ERROR_TITLE, LOAD_TEAMS_ERROR_DESCRIPTION, EMPTY_SUBMIT_TEAM_ERROR_DESCRIPTION, EMPTY_SUBMIT_TEAM_ERROR_TITLE, EMPTY_SUBMIT_UNIT_ERROR_DESCRIPTION, EMPTY_SUBMIT_UNIT_ERROR_TITLE, LOAD_UNITS_ERROR_DESCRIPTION } from '../../../models/constants';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import { getUnits } from '../../../services/unitsService';

interface UnitSearchProps {
    history: History;
}

const UnitSearch: React.FC<UnitSearchProps> = ({ history }) => {

    const [pageError, , clearErrors, setErrorMessage] = useError();
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    const onSelectedUnitChange = (selectedUnit: any) => {
        dispatch({ type: 'AddUnitUUID', payload: selectedUnit.value });

    };

    const handleOnSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        clearErrors();
        if (state.unitUUID.length === 0) {
            setErrorMessage(new ErrorMessage(EMPTY_SUBMIT_UNIT_ERROR_DESCRIPTION, EMPTY_SUBMIT_UNIT_ERROR_TITLE));
            return;
        }

        history.push(`/unit/${state.unitUUID}`);
    };

    const getUnitsForTypeahead = useCallback(() => new Promise<Item[]>(resolve => getUnits()
        .then((units: Item[]) => resolve(units))
        .catch(() => {
            setErrorMessage(new ErrorMessage(LOAD_UNITS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            resolve([]);
        })), []);

    return (
        <div className="govuk-form-group">
            <Link className="govuk-back-link" to="/">Back</Link>
            <ErrorSummary pageError={pageError} />
            <h1 className="govuk-heading-xl">
                Unit search
            </h1>
            <TypeAhead
                clearable={true}
                disabled={false}
                getOptions={getUnitsForTypeahead}
                label={'Units'}
                name={'Units'}
                onSelectedItemChange={onSelectedUnitChange}
            />
            <button type="submit" className="govuk-button view-unit-button" onClick={handleOnSubmit}>View unit</button>
        </div>
    );
};

export default UnitSearch;

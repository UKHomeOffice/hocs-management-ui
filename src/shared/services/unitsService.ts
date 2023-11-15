import axios from 'axios';
import Unit from '../models/unit';
import ErrorMessage from '../models/errorMessage';
import { useCallback } from 'react';
import Item from '../models/item';
import { GENERAL_ERROR_TITLE, LOAD_UNITS_ERROR_DESCRIPTION } from '../models/constants';

export const createUnit = (unit: Unit) => new Promise((resolve, reject) => axios
    .post('/api/units', unit)
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

export const getUnits = () => new Promise<[Unit]>((resolve, reject) => axios
    .get('/api/units')
    .then(response => resolve(response.data))
    .catch(error => reject(error))
);

export const getUnitsForTypeAhead = (setErrorMessage: (arg0: ErrorMessage) => void) =>
    useCallback(() => new Promise<Item[]>(resolve => getUnits()
        .then((units) => {
            const items: Item[] = [];
            units.forEach(function (unit){
                items.push({ label: unit.displayName, value: unit.type });
            });
            resolve(items);
        })
        .catch(() => {
            setErrorMessage(new ErrorMessage(LOAD_UNITS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            resolve([]);
        })
    ),[]);

import axios from 'axios';
import Unit from '../models/unit';
import Item from 'shared/models/item';

export const createUnit = (unit: Unit) => new Promise((resolve, reject) => axios
    .post('/api/units', unit)
    .then(() => resolve())
    .catch(reason => reject(reason))
);

export const getUnits = () => new Promise<[Item]>((resolve, reject) =>
    axios.get('/api/units')
        .then(response => resolve(response.data))
        .catch(error => reject(error))
);

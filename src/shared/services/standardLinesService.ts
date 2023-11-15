import axios from 'axios';
import UpdateRequest from 'shared/pages/standardLineAmend/updateRequest';

export const addStandardLine = (standardLine: FormData) => new Promise((resolve, reject) => axios
    .post('/api/standard-lines', standardLine)
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

export const updateStandardLine = (standardLine: UpdateRequest) => new Promise((resolve, reject) => axios
    .post('/api/standard-lines/update', standardLine)
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

export const getAllStandardLines = () => new Promise((resolve, reject) => axios
    .get('/api/standard-lines/all')
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);

export const getStandardLine = (standardLineUuid: string) => new Promise((resolve, reject) => axios
    .get(`/api/standard-lines/get/${standardLineUuid}`)
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);

export const expireStandardLine = (standardLineUuid: string) => new Promise((resolve, reject) => axios
    .post(`/api/standard-lines/expire/${standardLineUuid}`, {})
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

export const deleteStandardLine = (standardLineUuid: string) => new Promise((resolve, reject) => axios
    .delete(`/api/standard-lines/delete/${standardLineUuid}`, {})
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

export const downloadStandardLine = (standardLineUuid: string) => new Promise((resolve, reject) => axios
    .get(`/api/standard-lines/download/${standardLineUuid}`)
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);

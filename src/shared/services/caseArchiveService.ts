import axios from 'axios';
import ArchiveCaseModel from '../models/archiveCaseModel';

export const archiveCase = (archiveCaseModel: ArchiveCaseModel) => new Promise((resolve, reject) => axios
    .post('/api/case/archive', archiveCaseModel)
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

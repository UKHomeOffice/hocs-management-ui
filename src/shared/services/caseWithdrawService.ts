import axios from 'axios';
import WithdrawCaseModel from '../models/withdrawCaseModel';

export const withdrawCase = (withdrawCaseModel: WithdrawCaseModel) => new Promise((resolve, reject) => axios
    .post('/api/case/withdraw', withdrawCaseModel)
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

import { State } from './state';

export const initialState: State = {
    team: {
        displayName: '',
        permissions: [
            {
                accessLevel: 'OWNER',
                caseTypeCode: 'DTEN'
            },
            {
                accessLevel: 'OWNER',
                caseTypeCode: 'TRO'
            },
            {
                accessLevel: 'OWNER',
                caseTypeCode: 'MIN'
            }
        ],
        letterName: '',
        type: '',
        active: true,
        unitUUID: ''
    }
};

import React, { Reducer, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { updateListItem, getItemDetails } from '../../../services/entityListService';
import { reducer } from '../entityList/amendEntityReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import { GENERAL_ERROR_TITLE, AMEND_BUS_UNIT_ERROR_DESCRIPTION, AMEND_BUS_UNIT_SUCCESS, VALIDATION_ERROR_TITLE, LOAD_BUS_AREA_ERROR_DESCRIPTION } from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import { validate } from '../../../validation';
import { Action } from '../entityList/actions';
import { State } from '../entityList/amendEntityState';

interface MatchParams {
    type: string,
    itemUUID: string;
}
interface AmendCampaignProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
}

const validationSchema = object({
    title: string()
        .required()
        .label('New Business Unit name')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
});

const AmendBusinessUnit: React.FC<AmendCampaignProps> = ({ csrfToken, history, match }) => {
    const initialState: State = {
        uuid: '',
        title: '',
        originalTitle: '',
        simpleName: ''
    };

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    const { params: { type, itemUUID } } = match;

    useEffect(() => {
        getItemDetails(itemUUID)
            .then(item => dispatch({ type: 'SetItemDetails', payload: item }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_BUS_AREA_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, state, addFormError)) {
            updateListItem(state, type).then(() => {
                history.push('/', { successMessage: AMEND_BUS_UNIT_SUCCESS });
            }).catch((error) => {
                setErrorMessage(new ErrorMessage(AMEND_BUS_UNIT_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to={`/business-area/${type}`} className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Amend Business Unit
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <h2 className="govuk-heading-l">
                        {`Business Unit Name: ${state.originalTitle}`}
                    </h2>
                    <form action="/api/entity/list/update/MPAM_CAMPAIGNS" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="New Business Unit Name"
                            name="title"
                            type="text"
                            updateState={({ value }) => dispatch({ type: 'SetTitle', payload: value as string })}
                            value={state.title}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

export default AmendBusinessUnit;

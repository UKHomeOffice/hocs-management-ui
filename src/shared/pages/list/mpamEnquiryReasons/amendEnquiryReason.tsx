import React, { Reducer, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { updateListItem, getItemDetails } from '../../../services/entityListService';
import { reducer } from '../mpamCampaign/amendCampaignReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import {
    GENERAL_ERROR_TITLE,
    VALIDATION_ERROR_TITLE,
    LOAD_ENQ_SUB_ERROR_DESCRIPTION, AMEND_ENQ_REASON_SUCCESS, AMEND_ENQ_REASON_ERROR_DESCRIPTION
} from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import { validate } from '../../../validation';
import { Action } from '../mpamCampaign/actions';
import { State } from '../mpamCampaign/amendCampaignState';

interface MatchParams {
    subject: string,
    itemUUID: string;
}
interface AmendCampaignProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
}

const validationSchema = object({
    title: string()
        .required()
        .label('New Enquiry Reason')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
});

const AmendEnquiryReason: React.FC<AmendCampaignProps> = ({ csrfToken, history, match }) => {
    const initialState: State = {
        uuid: '',
        title: '',
        originalTitle: '',
        simpleName: ''
    };

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    const { params: { subject, itemUUID } } = match;

    useEffect(() => {
        getItemDetails(itemUUID)
            .then(item => dispatch({ type: 'SetItemDetails', payload: item }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_ENQ_SUB_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, state, addFormError)) {
            updateListItem(state, subject).then(() => {
                history.push('/', { successMessage: AMEND_ENQ_REASON_SUCCESS });
            }).catch((error) => {
                setErrorMessage(new ErrorMessage(AMEND_ENQ_REASON_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to={`/enquiry-subject/${subject}`} className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Amend Enquiry Reason
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <h3 className="govuk-heading-l">
                        {`Enquiry Reason: ${state.originalTitle}`}
                    </h3>
                    <form action={`/api/entity/list/update/${subject}`} method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="New Enquiry Reason"
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

export default AmendEnquiryReason;

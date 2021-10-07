import React, { Reducer } from 'react';
import useError from '../../../hooks/useError';
import {
    ADD_ENQ_REASON_ERROR_DESCRIPTION,
    ADD_ENQ_REASON_SUCCESS,
    DUPLICATE_ENQ_REASON_DESCRIPTION,
    GENERAL_ERROR_TITLE,
    VALIDATION_ERROR_TITLE
} from '../../../models/constants';
import EntityListItem from '../../../models/entityListItem';
import InputEventData from '../../../models/inputEventData';
import { reducer } from '../exGratiaBusinessReps/addBusinessRepReducer';
import { subjects } from '../mpamEnquiryReasons/subjects';
import { validate } from '../../../validation';
import { createListItem } from '../../../services/entityListService';
import ErrorMessage from '../../../models/errorMessage';
import { Link } from 'react-router-dom';
import ErrorSummary from '../../../common/components/errorSummary';
import Text from '../../../common/components/forms/text';
import Submit from '../../../common/components/forms/submit';
import { RouteComponentProps } from 'react-router';
import { object, string } from 'yup';

interface MatchParams {
    subject: string;
}

interface addEnquiryReasonProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
}

const validationSchema = object({
    title: string()
        .required()
        .label('Enquiry Reason')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
});

const AddEnquiryReason: React.FC<addEnquiryReasonProps> = ({ csrfToken, history, match }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [representative, dispatch] = React.useReducer<Reducer<EntityListItem, InputEventData>>(reducer, {
        uuid: '',
        title: '',
        simpleName: ''
    });

    const { params: { subject } } = match;
    const readableSubject = subjects[subject];

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, representative, addFormError)) {
            createListItem(representative, subject).then(() => {
                history.push('/', { successMessage: ADD_ENQ_REASON_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 409) {
                    setErrorMessage(new ErrorMessage(DUPLICATE_ENQ_REASON_DESCRIPTION, VALIDATION_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(ADD_ENQ_REASON_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    return (
        <>
            <div className='govuk-grid-row'>
                <div className='govuk-grid-column-two-thirds-from-desktop'>
                    <Link to={`/enquiry-subject/${subject}`} className='govuk-back-link'>Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className='govuk-heading-xl'>
                        Add Enquiry Reason to {readableSubject}
                    </h1>
                </div>
            </div>
            <div className='govuk-grid-row'>
                <div className='govuk-grid-column-one-half-from-desktop'>
                    <form action={`/api/entity/list/${subject}`} method='POST' onSubmit={handleSubmit}>
                        <input type='hidden' name='_csrf' value={csrfToken} />
                        <Text
                            label='Enquiry Reason'
                            name='title'
                            type='text'
                            value={representative.title}
                            updateState={({ name, value }) => dispatch({ name, value })}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddEnquiryReason;

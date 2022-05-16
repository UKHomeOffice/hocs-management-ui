import React, { Reducer } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { createListItem } from '../../../services/entityListService';
import { reducer } from '../exGratiaBusinessReps/addBusinessRepReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import { GENERAL_ERROR_TITLE, ADD_BUS_UNIT_ERROR_DESCRIPTION, ADD_BUS_UNIT_SUCCESS, VALIDATION_ERROR_TITLE, DUPLICATE_BUS_UNIT_DESCRIPTION } from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import EntityListItem from '../../../models/entityListItem';
import { validate } from '../../../validation';
import InputEventData from '../../../models/inputEventData';
import { listNames } from './listNames';

interface MatchParams {
    type: string;
}

interface addBusinessAreaProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
}

const validationSchema = object({
    title: string()
        .required()
        .label('Business Unit')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
});

const AddCompBusinessArea: React.FC<addBusinessAreaProps> = ({ csrfToken, history, match }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [representative, dispatch] = React.useReducer<Reducer<EntityListItem, InputEventData>>(reducer, {
        uuid: '',
        title: '',
        simpleName: ''
    });

    const { params: { type } } = match;
    const readableType = listNames[type];

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, representative, addFormError)) {
            createListItem(representative, type).then(() => {
                history.push('/', { successMessage: ADD_BUS_UNIT_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 409) {
                    setErrorMessage(new ErrorMessage(DUPLICATE_BUS_UNIT_DESCRIPTION, VALIDATION_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(ADD_BUS_UNIT_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to={`/comp-business-area/${type}`} className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Add Business Area to {readableType}
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action={`/api/entity/list/${type}`} method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="Business Area name"
                            name="title"
                            type="text"
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

export default AddCompBusinessArea;

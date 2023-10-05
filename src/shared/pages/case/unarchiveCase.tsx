import React, { Reducer } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../common/components/forms/submit';
import Text from '../../common/components/forms/text';
import { ApplicationConsumer } from '../../contexts/application';
import { archiveCase } from '../../services/caseArchiveService';
import { reducer } from './archiveCaseReducer';
import ErrorSummary from '../../common/components/errorSummary';
import {
    GENERAL_ERROR_TITLE,
    VALIDATION_ERROR_TITLE,
    UNARCHIVE_CASE_NOT_FOUND_ERROR_DESCRIPTION,
    UNARCHIVE_CASE_FORBIDDEN_ERROR_DESCRIPTION,
    UNARCHIVE_CASE_ERROR_DESCRIPTION,
    UNARCHIVE_CASE_SUCCESS
} from '../../models/constants';
import useError from '../../hooks/useError';
import ErrorMessage from '../../models/errorMessage';
import { validate } from '../../validation';
import InputEventData from '../../models/inputEventData';
import ArchiveCaseModel from '../../models/archiveCaseModel';

interface UnarchiveCaseProps extends RouteComponentProps {
    csrfToken?: string;
}

const validationSchema = object({
    caseReference: string()
        .required()
        .label('Case Reference')
        .matches(/^[a-zA-Z0-9_,.!/? ()&]*$/),
});

const UnarchiveCase: React.FC<UnarchiveCaseProps> = ({ csrfToken, history }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [archiveCaseModel, dispatch] = React.useReducer<Reducer<ArchiveCaseModel, InputEventData>>(reducer, {
        caseReference: '',
        deleted: false
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, archiveCaseModel, addFormError)) {
            archiveCase(archiveCaseModel).then(() => {
                history.push('/', { successMessage: UNARCHIVE_CASE_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 404) {
                    setErrorMessage(new ErrorMessage(UNARCHIVE_CASE_NOT_FOUND_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                } if (error && error.response && error.response.status === 403) {
                    setErrorMessage(new ErrorMessage(UNARCHIVE_CASE_FORBIDDEN_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(UNARCHIVE_CASE_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/" className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Unarchive a Case
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action="/api/case/archive" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="Case Reference"
                            name="caseReference"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={archiveCaseModel.caseReference}
                        />
                        <Submit label='Unarchive' />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedUnarchiveCase = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <UnarchiveCase csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedUnarchiveCase;

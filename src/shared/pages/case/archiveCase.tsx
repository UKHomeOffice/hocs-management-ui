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
    ARCHIVE_CASE_NOT_FOUND_ERROR_DESCRIPTION,
    ARCHIVE_CASE_FORBIDDEN_ERROR_DESCRIPTION,
    ARCHIVE_CASE_ERROR_DESCRIPTION,
    ARCHIVE_CASE_SUCCESS,
    UNARCHIVE_CASE_SUCCESS,
    UNARCHIVE_CASE_NOT_FOUND_ERROR_DESCRIPTION,
    UNARCHIVE_CASE_FORBIDDEN_ERROR_DESCRIPTION,
    UNARCHIVE_CASE_ERROR_DESCRIPTION
} from '../../models/constants';
import useError from '../../hooks/useError';
import ErrorMessage from '../../models/errorMessage';
import { validate } from '../../validation';
import InputEventData from '../../models/inputEventData';
import ArchiveCaseModel from '../../models/archiveCaseModel';

interface ArchiveCaseProps extends RouteComponentProps {
    csrfToken?: string;
    deleted?: boolean;
    label?: string;
}

const validationSchema = object({
    caseReference: string()
        .required()
        .label('Case Reference')
        .matches(/^[a-zA-Z0-9_,.!/? ()&]*$/),
});

const ArchiveCase: React.FC<ArchiveCaseProps> = ({ csrfToken, history, deleted, label }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [archiveCaseModel, dispatch] = React.useReducer<Reducer<ArchiveCaseModel, InputEventData>>(reducer, {
        caseReference: '',
        deleted: deleted ?? true
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, archiveCaseModel, addFormError)) {
            archiveCase(archiveCaseModel).then(() => {
                history.push('/', { successMessage: deleted ? ARCHIVE_CASE_SUCCESS : UNARCHIVE_CASE_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 404) {
                    setErrorMessage(new ErrorMessage(deleted ? ARCHIVE_CASE_NOT_FOUND_ERROR_DESCRIPTION : UNARCHIVE_CASE_NOT_FOUND_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                } if (error && error.response && error.response.status === 403) {
                    setErrorMessage(new ErrorMessage(deleted ? ARCHIVE_CASE_FORBIDDEN_ERROR_DESCRIPTION : UNARCHIVE_CASE_FORBIDDEN_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(deleted ? ARCHIVE_CASE_ERROR_DESCRIPTION : UNARCHIVE_CASE_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
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
                        {label} a Case
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
                        <Submit label={label} />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedArchiveCase = ({ history, location, match, deleted, label }: ArchiveCaseProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <ArchiveCase csrfToken={csrf} history={history} location={location} match={match} deleted={deleted} label={label} />
        )}
    </ApplicationConsumer>
);

export default WrappedArchiveCase;

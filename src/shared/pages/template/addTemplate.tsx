import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { array, object } from 'yup';
import Submit from '../../common/components/forms/submit';
import { ApplicationConsumer } from '../../contexts/application';
import ErrorSummary from '../../common/components/errorSummary';
import useError from '../../hooks/useError';
import * as constants from '../../models/constants';
import ErrorMessage from '../../models/errorMessage';
import { validate, checkIfFilesAreDocx } from '../../validation';
import DocumentAdd from '../../common/components/forms/documentAdd';
import { addTemplate } from '../../services/templatesService';
import { getCaseType } from '../../services/caseTypesService';
import CaseType from 'shared/models/caseType';
import Template from 'shared/models/template';

interface MatchParams {
    type: string;
}
interface AddTemplateProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
}

const validationSchema = object({
    files: array()
        .max(1)
        .min(1)
        .required()
        .label('Template')
        .test(
            'Template',
            'Only docx templates supported',
            (files: [File]) => checkIfFilesAreDocx(files),
        )
});

const AddTemplate: React.FC<AddTemplateProps> = ({ csrfToken, history, match }) => {
    const { params: { type } } = match;
    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', constants.VALIDATION_ERROR_TITLE);

    const [caseType, setCaseType] = useState<CaseType>();
    const [template, setTemplate] = React.useState<Template>();

    useEffect(() => {
        getCaseType(type)
            .then(setCaseType)
            .catch(() => {
                setErrorMessage(new ErrorMessage(constants.LOAD_CASE_TYPE_ERROR_DESCRIPTION, constants.GENERAL_ERROR_TITLE));
            });
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, template, addFormError) && caseType) {

            const data = new FormData();
            data.append('file', template!.files![0]);
            data.append('caseType', caseType.value);

            addTemplate(data).then(() => {
                history.push(`/case-type/${type}`, { successMessage: constants.ADD_TEMPLATE_SUCCESS });
            }).catch((_error: any) => {
                setErrorMessage(new ErrorMessage(constants.ADD_TEMPLATE_ERROR_DESCRIPTION, constants.GENERAL_ERROR_TITLE));
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to={`/case-type/${type}`} className="govuk-back-link">Back</Link>
                    <ErrorSummary pageError={pageError} />
                    <h1 className="govuk-heading-xl">
                        Add a Template
                    </h1>
                    <h2 className="govuk-heading-l">
                        {caseType && `Case Type: ${caseType.displayName}`}
                    </h2>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action="/api/template" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <DocumentAdd
                            name="files"
                            updateState={documentAddState => setTemplate({ files: documentAddState.value as File[] })}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAddTemplate = ({ history, location, match }: RouteComponentProps<MatchParams>) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <AddTemplate csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedAddTemplate;

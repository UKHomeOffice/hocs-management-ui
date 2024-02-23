import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { string } from 'yup';
import { ApplicationConsumer } from '../../../contexts/application';
import { ContextAction } from '../../../contexts/actions';
import ErrorSummary from '../../../common/components/errorSummary';
import { VALIDATION_ERROR_TITLE, ADD_PARENT_TOPIC_SUCCESS, DUPLICATE_PARENT_TOPIC_DESCRIPTION, ADD_PARENT_TOPIC_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE } from '../../../models/constants';
import useError from '../../../hooks/useError';
import { validate } from '../../../validation';
import ErrorMessage from '../../../models/errorMessage';
import Text from '../../../common/components/forms/text';

import { addParentTopic } from '../../../services/topicsService';
import Submit from '../../../common/components/forms/submit';
import InputEventData from '../../../models/inputEventData';

interface AddParentTopicProps extends RouteComponentProps {
    csrfToken?: string;
    contextDispatch: (action: ContextAction<any>) => Promise<any>;
}

const validationSchema = string()
    .required()
    .label('Display Name')
    .matches(/^[a-zA-Z0-9_,.!? ()&-]*$/)
    .label('Parent Topic')
;

const AddParentTopic: React.FC<AddParentTopicProps> = ({ csrfToken, contextDispatch, history }) => {
    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [displayName, setDisplayName] = React.useState<string>();

    const onDisplayNameChange = React.useCallback((e: InputEventData) => setDisplayName(e.value as string), []);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, displayName, addFormError)) {
            if (displayName !== undefined) {
                addParentTopic(displayName)
                    .then(() => history.push('/', { successMessage: ADD_PARENT_TOPIC_SUCCESS }))
                    .catch((error) => {
                        if (error && error.response && error.response.status === 400) {
                            setErrorMessage(new ErrorMessage(DUPLICATE_PARENT_TOPIC_DESCRIPTION, VALIDATION_ERROR_TITLE));
                        } else {
                            setErrorMessage(new ErrorMessage(ADD_PARENT_TOPIC_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                        }
                    });
            }
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
                        Add Parent Topic
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form method="POST" onSubmit={onSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="Topic Name"
                            name="displayName"
                            type="text"
                            updateState={onDisplayNameChange}
                            value={displayName}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAddParentTopic = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf, dispatch }) => (
            <AddParentTopic csrfToken={csrf} contextDispatch={dispatch} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedAddParentTopic;

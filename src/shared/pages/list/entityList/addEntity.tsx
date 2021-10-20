import React, { Reducer } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { ApplicationConsumer } from '../../../contexts/application';
import { createListItem } from '../../../services/entityListService';
import { reducer } from './addEntityReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import {
    GENERAL_ERROR_TITLE,
    VALIDATION_ERROR_TITLE
} from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import EntityListItem from '../../../models/entityListItem';
import { validate } from '../../../validation';
import InputEventData from '../../../models/inputEventData';

interface AddCampaignProps extends RouteComponentProps {
    csrfToken?: string;
    entityDefinition: EntityDefinition;
}

const AddEntity: React.FC<AddCampaignProps> = ({ csrfToken, history, entityDefinition }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [entity, dispatch] = React.useReducer<Reducer<EntityListItem, InputEventData>>(reducer, {
        uuid: '',
        title: '',
        simpleName: ''
    });

    const validationSchema = object({
        title: string()
            .required()
            .label(`${entityDefinition.entityNameCapitalised} name`)
            .matches(/^[a-zA-Z0-9_,.!? ()&]*$/),
        simpleName: string()
            .required()
            .label(`${entityDefinition.entityNameCapitalised} code`)
            .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, entity, addFormError)) {
            createListItem(entity, entityDefinition.entityListName).then(() => {
                history.push('/', { successMessage: entityDefinition.messages.ADD_ENTITY_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 409) {
                    setErrorMessage(new ErrorMessage(entityDefinition.messages.DUPLICATE_ENTITY_ERROR_DESCRIPTION, VALIDATION_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(entityDefinition.messages.ADD_ENTITY_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to={entityDefinition.entityRoute} className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        {`Add ${entityDefinition.entityNameCapitalised}`}
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action={`/api/entity/list/${entityDefinition.entityListName}`} method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label={`${entityDefinition.entityNameCapitalised} name`}
                            name="title"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={entity.title}
                        />
                        <Text
                            label={`${entityDefinition.entityNameCapitalised} code`}
                            name="simpleName"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={entity.simpleName}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAddEntity = (entityDefinition: EntityDefinition) => {
    const WrappedAddEntity = ({ history, location, match }: RouteComponentProps) => (
        <ApplicationConsumer>
            {({ csrf }) => (
                <AddEntity
                    csrfToken={csrf} history={history} location={location} match={match}
                    entityDefinition={entityDefinition}/>
            )}
        </ApplicationConsumer>
    );

    return WrappedAddEntity;
};

export default WrappedAddEntity;

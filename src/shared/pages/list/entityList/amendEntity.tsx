import React, { Reducer, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { ApplicationConsumer } from '../../../contexts/application';
import { updateListItem, getItemDetails } from '../../../services/entityListService';
import { reducer } from './amendEntityReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import {
    GENERAL_ERROR_TITLE,
    VALIDATION_ERROR_TITLE
} from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import { validate } from '../../../validation';
import { Action } from './actions';
import { State } from './amendEntityState';

interface MatchParams {
    itemUUID: string;
}
interface AmendEntityProps extends RouteComponentProps<MatchParams> {
    csrfToken?: string;
    entityDefinition: EntityDefinition;
}


const AmendEntity: React.FC<AmendEntityProps> =
        ({ csrfToken, history, match, entityDefinition }) => {
            const initialState: State = {
                uuid: '',
                title: '',
                originalTitle: '',
                simpleName: ''
            };

            const validationSchema = object({
                title: string()
                    .required()
                    .label(`New ${entityDefinition.entityName} name`)
                    .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
            });

            const [pageError, addFormError, clearErrors, setErrorMessage]
                = useError('', VALIDATION_ERROR_TITLE);
            const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

            const { params: { itemUUID } } = match;

            useEffect(() => {
                getItemDetails(itemUUID)
                    .then(item => dispatch({ type: 'SetItemDetails', payload: item }))
                    .catch(() => {
                        setErrorMessage(new ErrorMessage(
                            entityDefinition.messages.LOAD_ENTITIES_ERROR, GENERAL_ERROR_TITLE));
                    });
            }, []);

            const handleSubmit = (event: React.FormEvent) => {
                event.preventDefault();
                clearErrors();
                if (validate(validationSchema, state, addFormError)) {
                    updateListItem(state, entityDefinition.entityListName).then(() => {
                        history.push('/', { successMessage: entityDefinition.messages.AMEND_ENTITY_SUCCESS });
                    }).catch((error) => {
                        setErrorMessage(new ErrorMessage(entityDefinition.messages.AMEND_ENTITY_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
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
                                {`Amend ${entityDefinition.entityName}`}
                            </h1>
                        </div>
                    </div>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-half-from-desktop">
                            <h2 className="govuk-heading-l">
                                {`New ${entityDefinition.entityName}: ${state.originalTitle}`}
                            </h2>
                            <form action={`/api/entity/list/update/${entityDefinition.entityListName}`}
                                method="POST" onSubmit={handleSubmit}>
                                <input type="hidden" name="_csrf" value={csrfToken} />
                                <Text
                                    label={`New ${entityDefinition.entityName} name`}
                                    name="title"
                                    type="text"
                                    updateState={({ value }) => dispatch({ type: 'SetTitle', payload: value as string })}
                                    value={state.title}
                                />
                                <Text
                                    label={`${entityDefinition.entityName} code`}
                                    name="simpleName"
                                    type="text"
                                    disabled={true}
                                    updateState={({ value }) => dispatch({ type: 'SetSimpleName', payload: value as string })}
                                    value={state.simpleName}
                                />
                                <Submit />
                            </form>
                        </div>
                    </div>
                </>
            );
        };

const WrappedAmendEntity = (entityDefinition: EntityDefinition) => {
    const WrappedAmendEntity = ( { history, location, match } : RouteComponentProps<MatchParams>) => (
        <ApplicationConsumer>
            {({ csrf }) => (
                <AmendEntity csrfToken={csrf} history={history} location={location} match={match}
                    entityDefinition={entityDefinition}/>
            )}
        </ApplicationConsumer>
    );

    return WrappedAmendEntity;
};

export default WrappedAmendEntity;

import React, { Reducer, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { string, object } from 'yup';
import Submit from '../../../common/components/forms/submit';
import { ApplicationConsumer } from '../../../contexts/application';
import { addChildTopic, getParentTopics } from '../../../services/topicsService';
import { reducer } from './reducer';
import { State } from './state';
import { Action } from './actions';
import { initialState } from './initialState';
import { ContextAction, updateApiStatus } from '../../../contexts/actions';
import status from '../../../helpers/api-status.js';
import Item from '../../../models/item';
import useError from '../../../hooks/useError';
import { GENERAL_ERROR_TITLE, LOAD_PARENT_TOPICS_ERROR_DESCRIPTION, VALIDATION_ERROR_TITLE, DUPLICATE_CHILD_TOPIC_DESCRIPTION, ADD_CHILD_TOPIC_ERROR_DESCRIPTION, ADD_CHILD_TOPIC_SUCCESS } from '../../../models/constants';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import TypeAhead from '../../../common/components/typeAhead';
import Text from '../../../common/components/forms/text';
import { validate } from '../../../validation';
import { Link } from 'react-router-dom';
import InputEventData from '../../../models/inputEventData';

interface AddChildTopicProps extends RouteComponentProps {
    csrfToken?: string;
    contextDispatch: (action: ContextAction<any>) => Promise<any>;
}

const validationSchema = object({
    displayName: string()
        .required()
        .label('Display Name')
        .matches(/^[a-zA-Z0-9_,.!?' ()&-]*$/),
    selectedParentTopic: object({
        label: string()
            .required()
            .label('Parent Topic')
    }).label('Parent Topic')
});

const AddChildTopic: React.FC<AddChildTopicProps> = ({ csrfToken, contextDispatch, history }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);

    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);

    const getParentTopicsForTypeahead = useCallback(() => new Promise<Item[]>((resolve) => {
        contextDispatch(updateApiStatus(status.REQUEST_PARENT_TOPICS));
        getParentTopics()
            .then((parentTopics: Item[]) => {
                contextDispatch(updateApiStatus(status.REQUEST_PARENT_TOPICS_SUCCESS));
                resolve(parentTopics);
            })
            .catch(() => {
                contextDispatch(updateApiStatus(status.REQUEST_PARENT_TOPICS_FAILURE));
                setErrorMessage(new ErrorMessage(LOAD_PARENT_TOPICS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                resolve([]);
            });
    }), []);

    const onSelectedParentTopicChange = useCallback((selectedParentTopic: Item) => {
        dispatch({ type: 'SetSelectedParentTopic', payload: selectedParentTopic });
    }, []);

    const onDisplayNameChange = useCallback((e: InputEventData) => dispatch({ type: 'SetDisplayName', payload: e.value as string }), []);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, state, addFormError)) {
            addChildTopic(state.selectedParentTopic!.value, state.displayName)
                .then(() => history.push('/', { successMessage: ADD_CHILD_TOPIC_SUCCESS }))
                .catch((error) => {
                    if (error && error.response && error.response.status === 400) {
                        setErrorMessage(new ErrorMessage(DUPLICATE_CHILD_TOPIC_DESCRIPTION, VALIDATION_ERROR_TITLE));
                    } else {
                        setErrorMessage(new ErrorMessage(ADD_CHILD_TOPIC_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
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
                        Add Child Topic
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form method="POST" onSubmit={onSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <TypeAhead
                            clearable={true}
                            disabled={false}
                            getOptions={getParentTopicsForTypeahead}
                            label={'Select The Parent Topic'}
                            name={'parent-topics'}
                            onSelectedItemChange={onSelectedParentTopicChange}
                            value={state.selectedParentTopic}
                        />
                        <Text
                            label="Display Name"
                            name="displayName"
                            type="text"
                            updateState={onDisplayNameChange}
                            value={state.displayName}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAddChildTopic = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf, dispatch }) => (
            <AddChildTopic csrfToken={csrf} contextDispatch={dispatch} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedAddChildTopic;

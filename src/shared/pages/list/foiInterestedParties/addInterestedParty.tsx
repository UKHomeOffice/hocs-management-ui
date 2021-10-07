import React, { Reducer } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { ApplicationConsumer } from '../../../contexts/application';
import { createListItem } from '../../../services/entityListService';
import { reducer } from './addInterestedPartyReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import {
    GENERAL_ERROR_TITLE,
    VALIDATION_ERROR_TITLE,
    ADD_FOI_INTERESTED_PARTY_SUCCESS, DUPLICATE_FOI_INTERESTED_PARTY_DESCRIPTION, ADD_FOI_INTERESTED_PARTY_ERROR_DESCRIPTION
} from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import EntityListItem from '../../../models/entityListItem';
import { validate } from '../../../validation';
import InputEventData from '../../../models/inputEventData';

interface AddCampaignProps extends RouteComponentProps {
    csrfToken?: string;
}

const validationSchema = object({
    title: string()
        .required()
        .label('Interested party name')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/),
    simpleName: string()
        .required()
        .label('Interested party code')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
});

const AddInterestedParty: React.FC<AddCampaignProps> = ({ csrfToken, history }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [party, dispatch] = React.useReducer<Reducer<EntityListItem, InputEventData>>(reducer, {
        uuid: '',
        title: '',
        simpleName: ''
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, party, addFormError)) {
            createListItem(party, 'FOI_INTERESTED_PARTIES').then(() => {
                history.push('/', { successMessage: ADD_FOI_INTERESTED_PARTY_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 409) {
                    setErrorMessage(new ErrorMessage(DUPLICATE_FOI_INTERESTED_PARTY_DESCRIPTION, VALIDATION_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(ADD_FOI_INTERESTED_PARTY_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/manage-foi-interested-parties" className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Add interested party
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action="/api/entity/list/FOI_INTERESTED_PARTIES" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="Interested party name"
                            name="title"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={party.title}
                        />
                        <Text
                            label="Interested party code"
                            name="simpleName"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={party.simpleName}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedAddUnit = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <AddInterestedParty csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedAddUnit;

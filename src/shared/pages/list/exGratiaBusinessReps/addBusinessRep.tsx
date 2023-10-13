import React, { Reducer } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';
import Submit from '../../../common/components/forms/submit';
import Text from '../../../common/components/forms/text';
import { ApplicationConsumer } from '../../../contexts/application';
import { createListItem } from '../../../services/entityListService';
import { reducer } from './addBusinessRepReducer';
import ErrorSummary from '../../../common/components/errorSummary';
import { GENERAL_ERROR_TITLE, ADD_EXGRATIA_BUS_REP_ERROR_DESCRIPTION, ADD_EXGRATIA_BUS_REP_SUCCESS, VALIDATION_ERROR_TITLE, DUPLICATE_REPRESENTATIVE_DESCRIPTION } from '../../../models/constants';
import useError from '../../../hooks/useError';
import ErrorMessage from '../../../models/errorMessage';
import EntityListItem from '../../../models/entityListItem';
import { validate } from '../../../validation';
import InputEventData from '../../../models/inputEventData';

interface AddRepresentativeProps extends RouteComponentProps {
    csrfToken?: string;
}

const validationSchema = object({
    title: string()
        .required()
        .label('Representative name')
        .matches(/^[a-zA-Z0-9_,.!? ()&]*$/)
});

const AddBusinessRep: React.FC<AddRepresentativeProps> = ({ csrfToken, history }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [representative, dispatch] = React.useReducer<Reducer<EntityListItem, InputEventData>>(reducer, {
        uuid: '',
        title: '',
        simpleName: '',
        active: false
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, representative, addFormError)) {
            createListItem(representative, 'EXGRATIA_BUS_REPS').then(() => {
                history.push('/', { successMessage: ADD_EXGRATIA_BUS_REP_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 409) {
                    setErrorMessage(new ErrorMessage(DUPLICATE_REPRESENTATIVE_DESCRIPTION, VALIDATION_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(ADD_EXGRATIA_BUS_REP_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                }
            });
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/manage-exgratia-reps" className="govuk-back-link">Back</Link>
                    <ErrorSummary
                        pageError={pageError}
                    />
                    <h1 className="govuk-heading-xl">
                        Add Business Representative
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action="/api/entity/list/EXGRATIA_BUS_REPS" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="Representative name"
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

const WrappedAddUnit = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <AddBusinessRep csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedAddUnit;

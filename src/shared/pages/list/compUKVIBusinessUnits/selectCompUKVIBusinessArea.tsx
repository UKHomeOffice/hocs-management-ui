import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { string, object } from 'yup';
import Submit from '../../../common/components/forms/submit';
import { ApplicationConsumer } from '../../../contexts/application';
import ErrorSummary from '../../../common/components/errorSummary';
import useError from '../../../hooks/useError';
import * as constants from '../../../models/constants';
import { validate } from '../../../validation';
import TypeAhead from '../../../common/components/typeAhead';
import Item from '../../../models/item';
import { listNames } from './listNames';

interface ChooseCompUKVIBusinessAreaProps extends RouteComponentProps {
    csrfToken?: string;
}

const validationSchema = object({
    value: string()
        .required()
        .label('Business Area')
});

const ChooseCompUKVIBusinessArea: React.FC<ChooseCompUKVIBusinessAreaProps> = ({ csrfToken, history }) => {

    const [pageError, addFormError, clearErrors] = useError('', constants.VALIDATION_ERROR_TITLE);

    const [selectedCaseType, setSelectedCaseType] = React.useState<Item>();

    const items: Item[] = [];
    for(const key in listNames){
        items.push({ label: listNames[key], value: key });
    }

    const getBusinessAreas = () => Promise.resolve(items);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, selectedCaseType, addFormError)) {
            history.push(`/comp-business-area/${selectedCaseType!.value}`);
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/" className="govuk-back-link">Back</Link>
                    <ErrorSummary pageError={pageError} />
                    <h1 className="govuk-heading-xl">
                        Select a Directorate
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action="/api/template" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <TypeAhead
                            clearable={true}
                            disabled={false}
                            getOptions={getBusinessAreas}
                            label={'Directorate'}
                            name={'comp-business-area'}
                            onSelectedItemChange={setSelectedCaseType}
                            value={selectedCaseType}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedChooseCompUKVIBusinessArea = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <ChooseCompUKVIBusinessArea csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedChooseCompUKVIBusinessArea;

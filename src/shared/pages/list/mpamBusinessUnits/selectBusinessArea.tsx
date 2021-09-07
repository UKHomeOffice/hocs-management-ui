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

interface ChooseBusinessAreaProps extends RouteComponentProps {
    csrfToken?: string;
}

const validationSchema = object({
    value: string()
        .required()
        .label('Business Area')
});

const ChooseBusinessArea: React.FC<ChooseBusinessAreaProps> = ({ csrfToken, history }) => {

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
            history.push(`/business-area/${selectedCaseType!.value}`);
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/" className="govuk-back-link">Back</Link>
                    <ErrorSummary pageError={pageError} />
                    <h1 className="govuk-heading-xl">
                        Select a Business Area
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
                            label={'Business Areas'}
                            name={'business-areas'}
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

const WrappedChooseBusinessArea = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <ChooseBusinessArea csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedChooseBusinessArea;

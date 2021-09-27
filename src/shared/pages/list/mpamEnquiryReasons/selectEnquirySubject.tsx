import React from "react";
import useError from "../../../hooks/useError";
import * as constants from "../../../models/constants";
import Item from "../../../models/item";
import {subjects} from "./subjects";
import {validate} from "../../../validation";
import {Link} from "react-router-dom";
import ErrorSummary from "../../../common/components/errorSummary";
import TypeAhead from "../../../common/components/typeAhead";
import Submit from "../../../common/components/forms/submit";
import {RouteComponentProps} from "react-router";
import {object, string} from "yup";
import {ApplicationConsumer} from "../../../contexts/application";

interface ChooseEnquirySubjectProps extends RouteComponentProps {
    csrfToken?: string;
}

const validationSchema = object({
    value: string()
        .required()
        .label('Enquiry Subject')
});

const ChooseEnquirySubject: React.FC<ChooseEnquirySubjectProps> = ({ csrfToken, history }) => {

    const [pageError, addFormError, clearErrors] = useError('', constants.VALIDATION_ERROR_TITLE);

    const [selectedEnquirySubject, setSelectedEnquirySubject] = React.useState<Item>();

    const items: Item[] = [];
    for(const key in subjects){
        items.push({ label: subjects[key], value: key });
    }

    const getEnquirySubjects = () => Promise.resolve(items);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, selectedEnquirySubject, addFormError)) {
            history.push(`/enquiry-subject/${selectedEnquirySubject!.value}`);
        }
    };

    return (
        <>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds-from-desktop">
                    <Link to="/" className="govuk-back-link">Back</Link>
                    <ErrorSummary pageError={pageError} />
                    <h1 className="govuk-heading-xl">
                        Select an Enquiry Subject
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
                            getOptions={getEnquirySubjects}
                            label={'Business Areas'}
                            name={'business-areas'}
                            onSelectedItemChange={setSelectedEnquirySubject}
                            value={selectedEnquirySubject}
                        />
                        <Submit />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedChooseEnquirySubject = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <ChooseEnquirySubject csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedChooseEnquirySubject;

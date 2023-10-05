import React, { Reducer } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { object, string, date } from 'yup';
import Submit from '../../common/components/forms/submit';
import Text from '../../common/components/forms/text';
import TextArea from '../../common/components/forms/text-area';
import DateInput from '../../common/components/forms/date';
import { ApplicationConsumer } from '../../contexts/application';
import { withdrawCase } from '../../services/caseWithdrawService';
import { reducer } from './withdrawCaseReducer';
import ErrorSummary from '../../common/components/errorSummary';
import { GENERAL_ERROR_TITLE, VALIDATION_ERROR_TITLE, WITHDRAW_CASE_SUCCESS, WITHDRAW_CASE_ERROR_DESCRIPTION, WITHDRAW_CASE_NOT_FOUND_ERROR_DESCRIPTION, WITHDRAW_CASE_FORBIDDEN_ERROR_DESCRIPTION } from '../../models/constants';
import useError from '../../hooks/useError';
import ErrorMessage from '../../models/errorMessage';
import WithdrawCaseModel from '../../models/withdrawCaseModel';
import { validate } from '../../validation';
import InputEventData from '../../models/inputEventData';

interface WithdrawCaseProps extends RouteComponentProps {
    csrfToken?: string;
}

const validationSchema = object({
    caseReference: string()
        .required()
        .label('Case Reference')
        .matches(/^[a-zA-Z0-9_,.!/? ()&]*$/),
    withdrawalDate: date()
        .required()
        .max(new Date(), 'The Withdrawal Date must not be in the future')
        .label('Withdrawal Date'),
    notes: string()
        .required()
        .label('Notes')
});

const WithdrawCase: React.FC<WithdrawCaseProps> = ({ csrfToken, history }) => {

    const [pageError, addFormError, clearErrors, setErrorMessage] = useError('', VALIDATION_ERROR_TITLE);
    const [withdrawCaseModel, dispatch] = React.useReducer<Reducer<WithdrawCaseModel, InputEventData>>(reducer, {
        caseReference: '',
        notes: '',
        withdrawalDate: ''
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        if (validate(validationSchema, withdrawCaseModel, addFormError)) {
            withdrawCase(withdrawCaseModel).then(() => {
                history.push('/', { successMessage: WITHDRAW_CASE_SUCCESS });
            }).catch((error) => {
                if (error && error.response && error.response.status === 404) {
                    setErrorMessage(new ErrorMessage(WITHDRAW_CASE_NOT_FOUND_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                } if (error && error.response && error.response.status === 403) {
                    setErrorMessage(new ErrorMessage(WITHDRAW_CASE_FORBIDDEN_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                } else {
                    setErrorMessage(new ErrorMessage(WITHDRAW_CASE_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
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
                        Withdraw a Case
                    </h1>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                    <form action="/api/case/withdraw" method="POST" onSubmit={handleSubmit}>
                        <input type="hidden" name="_csrf" value={csrfToken} />
                        <Text
                            label="Case Reference"
                            name="caseReference"
                            type="text"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={withdrawCaseModel.caseReference}
                        />
                        <DateInput
                            label="Withdrawal Date"
                            name="withdrawalDate"
                            updateState={dispatch}
                        />
                        <TextArea
                            label="Notes"
                            name="notes"
                            updateState={({ name, value }) => dispatch({ name, value })}
                            value={withdrawCaseModel.notes}
                        />
                        <p className="govuk-inset-text"> The case will be closed and your comments added to the timeline, this action is not reversible.</p>
                        <Submit label="Withdraw" />
                    </form>
                </div>
            </div>
        </>
    );
};

const WrappedWithdrawCase = ({ history, location, match }: RouteComponentProps) => (
    <ApplicationConsumer>
        {({ csrf }) => (
            <WithdrawCase csrfToken={csrf} history={history} location={location} match={match} />
        )}
    </ApplicationConsumer>
);

export default WrappedWithdrawCase;

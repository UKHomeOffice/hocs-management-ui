import React, { Reducer, useCallback, useEffect } from 'react';
import useError from '../../../hooks/useError';
import CaseType from '../../../models/caseType';
import { subjects } from '../mpamEnquiryReasons/subjects';
import { getListItems } from '../../../services/entityListService';
import ErrorMessage from '../../../models/errorMessage';
import * as constants from '../../../models/constants';
import { Link } from 'react-router-dom';
import ErrorSummary from '../../../common/components/errorSummary';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import { State } from '../entityList/state';
import { Action } from '../entityList/actions';
import { reducer } from '../entityList/reducer';
import { initialState } from '../entityList/initialState';
import { ShowInactiveItemsToggle } from '../entityList/showInactiveItemsToggle';

interface MatchParams {
    subject: string;
}

type CasesProps = RouteComponentProps<MatchParams>;

const onAddEnquiryReasonClick = (history: History, subject: string) => {
    history.push(`/add-enquiry-reason/${subject}`);
};

const EnquirySubjectView: React.FC<CasesProps> = ({ history, match }) => {

    const [pageError, , , setErrorMessage] = useError();
    const [enquirySubject] = React.useState<CaseType>();

    const [state, dispatch] = React.useReducer<Reducer<State, Action>>(reducer, initialState);
    const enquirySubjects = state.entitiesToDisplay;

    const { params: { subject } } = match;
    const readableSubject = subjects[subject];

    useEffect(() => {
        getListItems(subject)
            .then(payload => dispatch({ type: 'PopulateEntities', payload }))
            .catch(() => {
                setErrorMessage(new ErrorMessage(constants.LOAD_ENQ_SUB_ERROR_DESCRIPTION, constants.GENERAL_ERROR_TITLE));
            });
    }, []);

    const toggleShowInactive = useCallback(
        (showInactive: boolean) => dispatch({ type: 'ToggleShowInactive', payload: showInactive }), [dispatch]
    );

    return (
        <div className='govuk-form-group'>
            <Link to='/manage-mpam-enquiry-reasons' className='govuk-back-link'>Back</Link>
            <ErrorSummary
                pageError={pageError}
            />
            <div>
                <h1 className='govuk-heading-xl'>View and Edit Enquiry Reasons for {readableSubject}</h1>
                {enquirySubject && <h2 className='govuk-heading-l'>
                    {`Enquiry Subject: ${enquirySubject.displayName}`}
                </h2>}
                {
                    enquirySubjects && enquirySubjects.length > 0 ?
                        <div>
                            <ShowInactiveItemsToggle
                                inactiveCount={state.inactiveCount}
                                showInactive={state.showInactive}
                                onToggle={toggleShowInactive}
                            />
                            <table className='govuk-table'>
                                <thead className='govuk-table__head'>
                                    <tr className='govuk-table__row'>
                                        <th className='govuk-table__header' scope='col'>Enquiry Reason</th>
                                        {state.showInactive && <th className="govuk-table__header" scope="col">Active?</th>}
                                        <th className="govuk-table__header" scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className='govuk-table__body'>
                                    {
                                        enquirySubjects.map((enquirySubject) => {
                                            return (
                                                <tr className='govuk-table__row' key={enquirySubject.simpleName}>
                                                    <td className='govuk-table__cell'>{enquirySubject.title}</td>
                                                    {state.showInactive && <td className="govuk-table__cell" scope="col">{enquirySubject.active ? 'Yes' : 'No'}</td>}
                                                    <td className="govuk-table__cell">
                                                        <Link to={`/amend-enquiry-reason/${subject}/${enquirySubject.uuid}`}>Amend</Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div> :
                        <div>
                            <p className='govuk-body'>Loading...</p>
                        </div>
                }
                <button
                    type='submit'
                    className='govuk-button govuk-!-margin-right-1 add-team-members-button'
                    data-module='govuk-button'
                    name="add-enquiry-reason-button"
                    role="link"
                    onClick={() => onAddEnquiryReasonClick(history, subject)}
                >
                    Add Enquiry Reason
                </button>
            </div>
        </div>
    );
};

export default EnquirySubjectView;

import React, { useEffect } from 'react';
import useError from '../../../hooks/useError';
import CaseType from '../../../models/caseType';
import EntityListItem from '../../../models/entityListItem';
import { subjects } from '../mpamEnquiryReasons/subjects';
import { getListItems } from '../../../services/entityListService';
import ErrorMessage from '../../../models/errorMessage';
import * as constants from '../../../models/constants';
import { Link } from 'react-router-dom';
import ErrorSummary from '../../../common/components/errorSummary';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';

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

    const [enquirySubjects, setEnquirySubjects] = React.useState<EntityListItem[]>();

    const { params: { subject } } = match;
    const readableSubject = subjects[subject];

    useEffect(() => {
        getListItems(subject)
            .then(setEnquirySubjects)
            .catch(() => {
                setErrorMessage(new ErrorMessage(constants.LOAD_ENQ_SUB_ERROR_DESCRIPTION, constants.GENERAL_ERROR_TITLE));
            });
    }, []);

    return (
        <div className='govuk-form-group'>
            <Link to='/manage-mpam-enquiry-reasons' className='govuk-back-link'>Back</Link>
            <ErrorSummary
                pageError={pageError}
            />
            <div>
                <h1 className='govuk-heading-xl'>View and Edit Enquiry Reasons for {readableSubject}</h1>
                <h2 className='govuk-heading-l'>
                    {enquirySubject && `Enquiry Subject: ${enquirySubject.displayName}`}
                </h2>
                {
                    enquirySubjects && enquirySubjects.length > 0 ?
                        <div>
                            <table className='govuk-table'>
                                <thead className='govuk-table__head'>
                                    <tr className='govuk-table__row'>
                                        <th className='govuk-table__header' scope='col'>Enquiry Reason</th>
                                        <th className="govuk-table__header" scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className='govuk-table__body'>
                                    {
                                        enquirySubjects.map((enquirySubject) => {
                                            return (
                                                <tr className='govuk-table__row' key={enquirySubject.simpleName}>
                                                    <td className='govuk-table__cell'>{enquirySubject.title}</td>
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
                    onClick={() => onAddEnquiryReasonClick(history, subject)}
                >
                    Add Enquiry Reason
                </button>
            </div>
        </div>
    );
};

export default EnquirySubjectView;

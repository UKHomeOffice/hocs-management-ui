import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';
import * as constants from '../../../models/constants';
import ErrorSummary from '../../../common/components/errorSummary';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';
import CaseType from 'shared/models/caseType';
import EntityListItem from '../../../../shared/models/entityListItem';
import { getListItems } from '../../../../shared/services/entityListService';
import { listNames } from './listNames';

interface MatchParams {
    type: string;
}

type CasesProps = RouteComponentProps<MatchParams>;

const onAddBusinessAreaClick = (history: History, type: string) => {
    history.push(`/add-comp-business-area/${type}`);
};

const onAmendBusinessAreaClick = (history: History, uuid: string, type: string) => {
    history.push(`/amend-comp-business-area/${type}/${uuid}`);
};

const ComplaintsBusinessAreaView: React.FC<CasesProps> = ({ history, match }) => {


    const [pageError, , , setErrorMessage] = useError();
    const [caseType] = React.useState<CaseType>();

    const [businessAreas, setBusinessAreas] = React.useState<EntityListItem[]>();

    const { params: { type } } = match;
    const readableType = listNames[type];

    useEffect(() => {
        getListItems(type)
            .then(setBusinessAreas)
            .catch(() => {
                setErrorMessage(new ErrorMessage(constants.LOAD_BUS_AREA_ERROR_DESCRIPTION, constants.GENERAL_ERROR_TITLE));
            });
    }, []);

    return (
        <div className="govuk-form-group">
            <Link to="/manage-comp-ukvi-bus-area" className="govuk-back-link">Back</Link>
            <ErrorSummary
                pageError={pageError}
            />
            <div>
                <h1 className="govuk-heading-xl">View and Edit Business Areas for {readableType}</h1>
                <h2 className="govuk-heading-l">
                    {caseType && `Business Area: ${caseType.displayName}`}
                </h2>
                {
                    businessAreas && businessAreas.length > 0 ?
                        <div>
                            <table className="govuk-table">
                                <thead className="govuk-table__head">
                                    <tr className="govuk-table__row">
                                        <th className="govuk-table__header" scope="col">Business Unit</th>
                                        <th className="govuk-table__header" scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="govuk-table__body">
                                    {
                                        businessAreas.map((businessArea) => {
                                            return (
                                                <tr className="govuk-table__row" key={businessArea.simpleName}>
                                                    <td className="govuk-table__cell">{businessArea.title}</td>
                                                    <td className="govuk-table__cell">
                                                        <a href="#" onClick={event => onAmendBusinessAreaClick(history, businessArea.uuid, type)}>Amend</a>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div> :
                        <div>
                            <p className="govuk-body">Loading...</p>
                        </div>
                }
                <button
                    type="submit"
                    className="govuk-button govuk-!-margin-right-1 add-team-members-button"
                    data-module="govuk-button"
                    onClick={() => onAddBusinessAreaClick(history, type)}
                >
                    Add Business Area
                </button>
            </div>
        </div>
    );
};

export default ComplaintsBusinessAreaView;

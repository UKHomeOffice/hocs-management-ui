import React, { useContext, useEffect } from 'react';
import { getNominatedContactsForTeam, removeNominatedContactFromTeam } from '../../../services/nominatedContactsService';
import Item from '../../../models/item';
import { ContactsContext } from './contactsContext';
import ErrorMessage from '../../../models/errorMessage';
import {
    DELETE_NOMINATED_CONTACTS_ERROR_DESCRIPTION,
    DELETE_NOMINATED_CONTACTS_MINIMUM_CONTACT_NUMBER_ERROR_DESCRIPTION,
    GENERAL_ERROR_TITLE,
    LOAD_NOMINATED_CONTACTS_ERROR_DESCRIPTION
} from '../../../models/constants';

interface MatchParams {
    teamId: string;
    errorFuncs: any;
}


const NominatedContactList: React.FC<MatchParams> = ({ teamId, errorFuncs }) => {
    const { state: { contacts }, dispatch } = useContext(ContactsContext);
    const [, , clearErrors, setErrorMessage] = errorFuncs;

    useEffect(() => {
        getNominatedContactsForTeam(teamId)
            .then(contacts => {
                const contactsAsItems: Array<Item> = contacts.map(contact => ( { value: contact.uuid, label: contact.emailAddress } ));
                dispatch({ type: 'SetContacts', payload: contactsAsItems });
            })
            .catch((e) => {
                setErrorMessage(new ErrorMessage(LOAD_NOMINATED_CONTACTS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
    }, []);

    const onRemoveContact = (e: any, contact: Item) => {
        e.preventDefault();
        clearErrors();
        if (contacts.length > 1) {
            removeNominatedContactFromTeam(teamId, contact.value).then(() =>
            {
                dispatch({ type: 'RemoveContact', payload: contact });
            }
            ).catch(() => {
                setErrorMessage(new ErrorMessage(DELETE_NOMINATED_CONTACTS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
            });
        } else {
            setErrorMessage(new ErrorMessage(DELETE_NOMINATED_CONTACTS_MINIMUM_CONTACT_NUMBER_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
        }
    };

    return (<div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds-from-desktop">
            <table className="govuk-table">
                <caption className="govuk-table__caption">Nominated contacts:</caption>
                {contacts.length > 0 && <tbody className="govuk-table__body">
                    {contacts.map(contact => (
                        <tr key={contact.value} className="govuk-table__row">
                            <th scope="row" className="govuk-table__header">
                                {contact.label}
                            </th>
                            <td className="govuk-table__cell">
                                <a className="govuk-link" href="#" onClick={(e) => onRemoveContact(e, contact)}>
                                    Remove<span className="govuk-visually-hidden"> contact</span>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
                }
                {contacts.length === 0 && <tbody className="govuk-table__body">

                    <tr key="none" className="govuk-table__row">
                        <td className="govuk-table__cell">
                    None
                        </td>
                    </tr>

                </tbody>
                }
            </table>
        </div>
    </div>);
};

export default NominatedContactList;

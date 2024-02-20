import React, { useCallback } from 'react';
import TypeAhead from '../../../common/components/typeAhead';
import { getUsers } from '../../../services/usersService';
import { History } from 'history';
import Item from '../../../models/item';
import ErrorSummary from '../../../common/components/errorSummary';
import { EMPTY_SUBMIT_USER_ERROR_DESCRIPTION, EMPTY_SUBMIT_USER_ERROR_TITLE, GENERAL_ERROR_TITLE, LOAD_USERS_ERROR_DESCRIPTION } from '../../../models/constants';
import ErrorMessage from '../../../models/errorMessage';
import useError from '../../../hooks/useError';
import { Link } from 'react-router-dom';

interface UserSearchProps {
    history: History;
}

const UserSearch: React.FC<UserSearchProps> = ({ history }) => {

    const [pageError, , clearErrors, setErrorMessage] = useError();
    const [selectedUser, setSelectedUser] = React.useState<Item>();

    const handleOnSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        clearErrors();
        if (selectedUser) {
            history.push(`/user-view/${selectedUser!.value}`);
            return;
        }
        setErrorMessage(new ErrorMessage(EMPTY_SUBMIT_USER_ERROR_DESCRIPTION, EMPTY_SUBMIT_USER_ERROR_TITLE));
    };

    const getUsersForTypeahead = useCallback(() => new Promise<Item[]>(
        resolve => getUsers()
            .then((users: Item[]) => resolve(users))
            .catch(() => {
                setErrorMessage(new ErrorMessage(LOAD_USERS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
                resolve([]);
            })), []);

    return (
        <div className="govuk-form-group">
            <Link className="govuk-back-link" to="/">Back</Link>
            <ErrorSummary pageError={pageError} />
            <h1 className="govuk-heading-xl">User search</h1>
            <TypeAhead
                clearable={true}
                disabled={false}
                getOptions={getUsersForTypeahead}
                label={'Users'}
                name={'Users'}
                onSelectedItemChange={setSelectedUser}
            />
            <button
                type="submit"
                className="govuk-button view-user-button"
                name="view-user-button"
                role="link"
                onClick={handleOnSubmit}
            >
                View user
            </button>
        </div>
    );
};

export default UserSearch;

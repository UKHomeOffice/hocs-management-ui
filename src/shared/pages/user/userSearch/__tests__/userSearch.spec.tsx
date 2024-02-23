import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History } from 'history';
import { act, fireEvent, getByText, render, RenderResult, waitFor } from '@testing-library/react';
import UserSearch from '../userSearch';
import * as UsersService from '../../../../services/usersService';
import * as useError from '../../../../hooks/useError';
import Item from '../../../../models/item';
import { EMPTY_SUBMIT_USER_ERROR_DESCRIPTION, EMPTY_SUBMIT_USER_ERROR_TITLE, GENERAL_ERROR_TITLE, LOAD_USERS_ERROR_DESCRIPTION } from '../../../../models/constants';
import ErrorMessage from '../../../../models/errorMessage';

let history: History<any>;
let mockState: Item | undefined;

jest.mock('../../../../services/usersService', () => ({
    __esModule: true,
    getUsers: jest.fn().mockReturnValue(Promise.resolve([{
        label: 'Home Office General Property',
        value: '1aa9055d-0572-436b-a69d-4a97588f4ce4'
    }, {
        label: 'Home Office General Property',
        value: '1aa9055d-0572-436b-a69d-4a97588f4ce4'
    }]))
}));

const getUsersSpy = jest.spyOn(UsersService, 'getUsers');
const useStateSpy = jest.spyOn(React, 'useState');
const useErrorSpy = jest.spyOn(useError, 'default');
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <UserSearch history={history}></UserSearch>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    mockState = {
        label: '__userName__',
        value: '__userValue__'
    };
    useStateSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the userView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        let wrapper: RenderResult;
        act(() => { wrapper = renderComponent(); });

        await waitFor(() => {
            expect(getUsersSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the view user button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => { wrapper = renderComponent(); });

        await waitFor(async () => {
            const viewUserButton = getByText(wrapper.container, 'View user');
            fireEvent.click(viewUserButton);
        });

        expect(history.push).toHaveBeenCalledWith('/user-view/__userValue__');
    });
});

describe('when no users are retrieved for the typeahead', () => {
    it('should throw error', async () => {
        getUsersSpy.mockImplementation(() => Promise.reject('ERROR'));

        act(() => {
            renderComponent();
        });

        await waitFor(async () => {
            expect(setMessageSpy).toHaveBeenCalledWith(new ErrorMessage(LOAD_USERS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
        });

    });
});

describe('when a user is not selected', () => {
    it('should throw error', async () => {
        history.push = jest.fn();
        mockState = undefined;
        useStateSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
        let wrapper: RenderResult;
        act(() => { wrapper = renderComponent(); });

        await waitFor(async () => {
            const viewUserButton = getByText(wrapper.container, 'View user');
            fireEvent.click(viewUserButton);
        });

        expect(setMessageSpy).toHaveBeenCalledWith(new ErrorMessage(EMPTY_SUBMIT_USER_ERROR_DESCRIPTION, EMPTY_SUBMIT_USER_ERROR_TITLE));
    });
});

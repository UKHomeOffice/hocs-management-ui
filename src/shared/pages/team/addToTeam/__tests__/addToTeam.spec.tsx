import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, waitFor, fireEvent, getByText } from '@testing-library/react';
import AddToTeam from '../addToTeam';
import * as TeamsService from '../../../../services/teamsService';
import * as UsersService from '../../../../services/usersService';
import { State } from '../state';
import { GENERAL_ERROR_TITLE, LOAD_TEAM_ERROR_DESCRIPTION, LOAD_USERS_ERROR_DESCRIPTION } from '../../../../models/constants';
import * as useError from '../../../../hooks/useError';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

jest.mock('../../../../services/teamsService', () => ({
    __esModule: true,
    getTeam: jest.fn().mockReturnValue(Promise.resolve({
        active: true,
        displayName: '__displayName__',
        letterName: '__letterName__',
        permissions: [],
        type: '__type__'
    }))
}));

jest.mock('../../../../services/usersService', () => ({
    __esModule: true,
    addUsersToTeam: jest.fn().mockReturnValue(Promise.resolve()),
    getUsers: jest.fn().mockReturnValue(Promise.resolve(
        [{
            label: '__user1__',
            value: '__userId1__'
        }, {
            label: '__user2__',
            value: '__userId2__'
        }]
    ))
}));

const getTeamSpy = jest.spyOn(TeamsService, 'getTeam');
const addUsersToTeamSpy = jest.spyOn(UsersService, 'addUsersToTeam');
const getUsersSpy = jest.spyOn(UsersService, 'getUsers');
const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <AddToTeam history={history} location={location} match={match}></AddToTeam>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: { teamId: '__teamId__' },
        path: '',
        url: ''
    };

    location = {
        hash: '',
        key: '',
        pathname: '',
        search: '',
        state: {}
    };
    mockState = {
        inputValue: '',
        selectedUser: undefined,
        selectedUsers: [{
            label: '__user1__',
            value: '__userId1__'
        }, {
            label: '__user2__',
            value: '__userId2__'
        }],
        teamName: '__teamName__'
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, reducerDispatch]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorSpy, clearErrorsSpy, setMessageSpy]);
    reducerDispatch.mockReset();
    addFormErrorSpy.mockReset();
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the addToTeam component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(3);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(getTeamSpy).toHaveBeenCalled();
            expect(getUsersSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should display an error if the call to retrieve the team fails', async () => {
        expect.assertions(2);
        getTeamSpy.mockImplementation(() => Promise.reject('error'));

        renderComponent();

        await waitFor(() => {
            expect(setMessageSpy).toBeCalledWith({ title: GENERAL_ERROR_TITLE, description: LOAD_TEAM_ERROR_DESCRIPTION });
        });

    });
    it('should display an error if the call to retrieve the users fails', async () => {
        expect.assertions(2);
        getUsersSpy.mockImplementation(() => Promise.reject('error'));

        renderComponent();

        await waitFor(() => {
            expect(setMessageSpy).toBeCalledWith({ title: GENERAL_ERROR_TITLE, description: LOAD_USERS_ERROR_DESCRIPTION });
        });

    });
});

describe('when the submit button is clicked', () => {
    let wrapper: RenderResult;

    beforeEach(() => {
        act(() => {
            wrapper = renderComponent();
        });
    });

    it('should call the service and dispatch actions for the selected options', async () => {
        await waitFor(async () => {
            const submitButton = getByText(wrapper.container, 'Add selected users');
            fireEvent.click(submitButton);
        });

        await waitFor(async () => {
            expect(addUsersToTeamSpy).nthCalledWith(1, [
                { 'label': '__user1__', 'value': '__userId1__' },
                { 'label': '__user2__', 'value': '__userId2__' }],
            '__teamId__');
            expect(clearErrorsSpy).toBeCalled();
            expect(reducerDispatch).nthCalledWith(1, {
                type: 'RemoveAllFromSelection'
            });
        });
    });

    it('should display errors for each erroring team member add request', async () => {
        expect.assertions(1);
        addUsersToTeamSpy.mockImplementation(() => Promise.reject({
            usersToAdd: [{
                label: '__label__',
                value: '__value__'
            }]
        }));

        await waitFor(() => {
            const submitButton = getByText(wrapper.container, 'Add selected users');
            fireEvent.click(submitButton);
        });

        expect(addFormErrorSpy).nthCalledWith(1, { key: '__value__', value: '__label__' });
    });

    it('should set an error when no users are selected', async () => {
        mockState.selectedUsers = [];
        await waitFor(async () => {
            const submitButton = getByText(wrapper.container, 'Add selected users');
            fireEvent.click(submitButton);
        });

        await waitFor(async () => {
            expect(setMessageSpy).toBeCalledWith({
                description: 'Please select some users before submitting.',
                title: 'No users selected'
            });
        });
    });
});

describe('when the remove button is clicked', () => {
    it('should remove the row from the selected users collection', async () => {
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const selectedUser = getByText(wrapper.container, '__user1__');
            // dispatch.mockReset();
            const row = (selectedUser.closest('tr'));
            const removeButton = getByText(row as HTMLElement, 'Remove');
            fireEvent.click(removeButton);
        });

        expect(reducerDispatch).nthCalledWith(1, { type: 'RemoveFromSelection', payload: { label: '__user1__', value: '__userId1__' } });
    });
});

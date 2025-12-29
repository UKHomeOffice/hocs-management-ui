import React from 'react';
import * as useError from '../../../../hooks/useError';
import { State } from '../reducer';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, createLocation, History, Location } from 'history';
import * as TeamsService from '../../../../services/teamsService';
import * as UsersService from '../../../../services/usersService';
import AddTeamToUser from '../addTeamToUser';
import { act, fireEvent, getByText, render, RenderResult, waitFor } from '@testing-library/react';
import ErrorMessage from '../../../../models/errorMessage';
import { EMPTY_TEAMS_SUBMIT_ERROR_DESCRIPTION, EMPTY_TEAMS_SUBMIT_ERROR_TITLE, GENERAL_ERROR_TITLE, LOAD_TEAMS_ERROR_DESCRIPTION, LOAD_USER_ERROR_DESCRIPTION } from '../../../../models/constants';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

jest.mock('../../../../services/teamsService', () => ({
    __esModule: true,
    getTeams: jest.fn().mockReturnValue(Promise.resolve([
        {
            label: '__team1__',
            value: '__teamId1__'
        },
        {
            label: '__team2__',
            value: '__teamId2__'
        },
        {
            label: '__team3__',
            value: '__teamId3__'
        },
        {
            label: '__team4__',
            value: '__teamId4__'
        }
    ]))
}));
jest.mock('../../../../services/usersService', () => ({
    __esModule: true,
    addUsersToTeam: jest.fn().mockReturnValue(Promise.resolve()),
    getUser: jest.fn().mockReturnValue(Promise.resolve({
        label: '__user__',
        value: '__userId__'
    }))
}));

const getTeamsSpy = jest.spyOn(TeamsService, 'getTeams');
const addUserToTeamSpy = jest.spyOn(UsersService, 'addUsersToTeam');
const getUserSpy = jest.spyOn(UsersService, 'getUser');
const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <AddTeamToUser history={history} location={location} match={match}/>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: { userId: '__userId__' },
        path: '',
        url: ''
    };

    location = createLocation('/');

    mockState = {
        user: {
            id: '__user__',
            username: 'd',
            email: 'd',
            firstName: 'd',
            lastName: 'd',
            enabled: false
        },
        selectedTeam: {
            label: '__team1__',
            value: '__teamId__'
        },
        selectedTeams: [{
            label: '__team1__',
            value: '__teamId1__'
        }, {
            label: '__team2__',
            value: '__teamId2__'
        }]
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, reducerDispatch]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorSpy, clearErrorsSpy, setMessageSpy]);
    reducerDispatch.mockReset();
    addFormErrorSpy.mockReset();
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the addTeamToUser component is mounted', () => {
    it('should render', async () => {
        let wrapper: RenderResult;
        await act(async () => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(getUserSpy).toHaveBeenCalled();
            expect(getTeamsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should initially render null before the user is returned', async () => {
        let wrapper: RenderResult;
        getUserSpy.mockReturnValueOnce(Promise.resolve({
            id: '__user__',
            username: '__userId__',
            firstName: 'd',
            lastName: 'd',
            email: 'd',
            password: 'ewrwe',
            enabled: false
        }));

        await act(async () => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(wrapper.container.outerHTML).toMatchSnapshot();
        });
    });

    it('should display an error if the call to retrieve the user fails', async () => {
        expect.assertions(1);
        getUserSpy.mockImplementation(() => Promise.reject('error'));

        await act(async () => {
            renderComponent();
        });

        await waitFor(() => {
            expect(setMessageSpy).toHaveBeenCalledWith(new ErrorMessage(LOAD_USER_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
        });
    });

    it('should display an error if the call to retrieve the teams fails', async () => {
        expect.assertions(1);
        getTeamsSpy.mockImplementation(() => Promise.reject('error'));

        await act(async () => {
            renderComponent();
        });

        await waitFor(() => {
            expect(setMessageSpy).toHaveBeenCalledWith(new ErrorMessage(LOAD_TEAMS_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE));
        });

    });

});

describe('when the submit button is clicked', () => {
    let wrapper: RenderResult;
    beforeEach(async () => {
        await act(async () => {
            wrapper = renderComponent();
        });
    });

    it('should call the service and dispatch actions for the selected options', async () => {
        expect.assertions(3);

        await act(async () => {
            const submitButton = getByText(wrapper.container, 'Add selected teams');
            fireEvent.click(submitButton);
        });

        await waitFor(async () => {
            expect(addUserToTeamSpy).toHaveBeenNthCalledWith(1, [{
                label: 'd',
                value: '__user__'
            }], '__teamId1__');
            expect(addUserToTeamSpy).toHaveBeenNthCalledWith(2, [{
                label: 'd',
                value: '__user__'
            }], '__teamId2__');
            expect(clearErrorsSpy).toHaveBeenCalled();
        });
    });

    it('should display errors for each erroring team member add request', async () => {
        addUserToTeamSpy.mockImplementationOnce(() => Promise.reject('Error'));

        await act(async () => {
            const submitButton = getByText(wrapper.container, 'Add selected teams');
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(setMessageSpy).toHaveBeenCalled();
        });
    });

    it('should set an error when no users are selected', async () => {
        mockState.selectedTeams = [];
        await act(async () => {
            const submitButton = getByText(wrapper.container, 'Add selected teams');
            fireEvent.click(submitButton);
        });

        await waitFor(async () => {
            expect(setMessageSpy).toHaveBeenCalledWith(new ErrorMessage(EMPTY_TEAMS_SUBMIT_ERROR_DESCRIPTION, EMPTY_TEAMS_SUBMIT_ERROR_TITLE));
        });
    });
});

describe('when the remove button is clicked', () => {
    it('should remove the row from the selected users collection', async () => {

        let wrapper: RenderResult;
        await act(async () => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const selectedTeam = getByText(wrapper.container, '__team2__');
            const row = (selectedTeam.closest('tr'));
            const removeButton = getByText(row as HTMLElement, 'Remove');
            fireEvent.click(removeButton);
        });

        expect(reducerDispatch).toHaveBeenCalledWith({ type: 'RemoveFromSelectedTeams', payload: { label: '__team2__', value: '__teamId2__' } });
    }, 20000);
});

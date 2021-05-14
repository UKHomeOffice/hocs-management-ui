import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, fireEvent, getByText, render, RenderResult, wait } from '@testing-library/react';
import UserView from '../userView';
import * as TeamsService from '../../../../services/teamsService';
import * as UsersService from '../../../../services/usersService';
import * as useError from '../../../../hooks/useError';
import { GENERAL_ERROR_TITLE, REMOVE_FROM_TEAM_ALLOCATED_ERROR_DESCRIPTION, REMOVE_FROM_TEAM_ERROR_DESCRIPTION, VALIDATION_ERROR_TITLE } from '../../../../models/constants';
let match: match<any>;
let history: History<any>;
let location: Location;

const userUUID = 'xx-xx-xx-xx';

jest.mock('../../../../services/teamsService', () => ({
    __esModule: true,
    getTeamsForUser: jest.fn().mockReturnValue(Promise.resolve(
        [{
            label: '__team1__',
            value: '__team1__'
        }, {
            label: '__team2__',
            value: '__team2__'
        }]
    ))
}));

jest.mock('../../../../services/usersService', () => ({
    __esModule: true,
    addUsersToTeam: jest.fn().mockReturnValue(Promise.resolve()),
    deleteUserFromTeam: jest.fn().mockReturnValue(Promise.resolve()),
    getUser: jest.fn().mockReturnValue(Promise.resolve(
        {
            label: '__user__',
            value: '__user__'
        }
    ))
}));

const getUserSpy = jest.spyOn(UsersService, 'getUser');
const getTeamsForUserSpy = jest.spyOn(TeamsService, 'getTeamsForUser');
const deleteUserFromTeamSpy = jest.spyOn(UsersService, 'deleteUserFromTeam');
const useErrorSpy = jest.spyOn(useError, 'default');
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();
clearErrorsSpy.mockReset();
setMessageSpy.mockReset();

const renderComponent = () => render(
    <MemoryRouter>
        <UserView history={history} location={location} match={match}/>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: { userId: userUUID },
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

    useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the teamView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(3);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(getUserSpy).toHaveBeenCalled();
            expect(getTeamsForUserSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the Add team members button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(async () => {
            const addTeamMembersButton = getByText(wrapper.container, 'Add teams');
            fireEvent.click(addTeamMembersButton);
        });

        expect(history.push).toHaveBeenCalledWith('/user/' + userUUID + '/add-teams');
    });
});

describe('when the remove user button is clicked', () => {
    it('should remove the row from the users table', async () => {
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(async () => {
            const selectedUser = getByText(wrapper.container, '__team1__');
            const row = (selectedUser.closest('tr'));
            const removeButton = getByText(row as HTMLElement, 'Remove');
            fireEvent.click(removeButton);
        });

        expect(deleteUserFromTeamSpy).nthCalledWith(1, userUUID, '__team1__');
        expect(getTeamsForUserSpy).nthCalledWith(1, userUUID);

    });

    describe('and the service call fails', () => {
        beforeEach(() => {
            let wrapper: RenderResult;
            act(() => {
                wrapper = renderComponent();
            });

            wait(async () => {
                const selectedUser = getByText(wrapper.container, '__user1__');
                const row = (selectedUser.closest('tr'));
                const removeButton = getByText(row as HTMLElement, 'Remove');
                fireEvent.click(removeButton);
            });
        });

        describe('and its a 500 error', () => {
            beforeAll(() => {
                jest.spyOn(UsersService, 'deleteUserFromTeam').mockImplementation(() => Promise.reject({ response: { status: 500 } }));
            });
            it('should set the error state', () => {
                wait(async () => {
                    expect(setMessageSpy).toHaveBeenCalledWith({ description: REMOVE_FROM_TEAM_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE });
                });
            });
            it('should call the clear errors method', () => {
                wait(async () => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });
        describe('and its a 409', () => {
            beforeAll(() => {
                jest.spyOn(UsersService, 'deleteUserFromTeam').mockImplementation(() => Promise.reject({ response: { status: 409 } }));
            });

            it('should set the error state', () => {
                wait(async () => {
                    expect(setMessageSpy).toHaveBeenCalledWith({ description: REMOVE_FROM_TEAM_ALLOCATED_ERROR_DESCRIPTION, title: VALIDATION_ERROR_TITLE });
                });
            });
        });
    });
});

describe('when the Amend Details button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(async () => {
            const addTeamMembersButton = getByText(wrapper.container, 'Amend Details');
            fireEvent.click(addTeamMembersButton);
        });

        expect(history.push).toHaveBeenCalledWith('/user/' + userUUID + '/amend');
    });
});

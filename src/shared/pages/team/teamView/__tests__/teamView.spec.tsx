import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, wait, fireEvent, getByText, render, RenderResult } from '@testing-library/react';
import TeamView from '../teamView';
import * as TeamsService from '../../../../services/teamsService';
import * as UsersService from '../../../../services/usersService';
import { State } from '../state';
import * as useError from '../../../../hooks/useError';
import { REMOVE_FROM_TEAM_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE, REMOVE_FROM_TEAM_ALLOCATED_ERROR_DESCRIPTION, VALIDATION_ERROR_TITLE } from '../../../../models/constants';
import { shallow } from 'enzyme';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

jest.mock('../../../../services/teamsService', () => ({
    __esModule: true,
    getTeamMembers: jest.fn().mockReturnValue(Promise.resolve({
        data: [{
            label: '__user1__',
            value: '__userId1__'
        }, {
            label: '__user2__',
            value: '__userId2__'
        }]
    })),
    getUnitForTeam: jest.fn().mockReturnValue(Promise.resolve({
        displayName: '__unit1__',
        shortCode: '__u1__',
        value: '__unit1_uuid__',
        type: '__unit1_type__'
    })),
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
    deleteUserFromTeam: jest.fn().mockReturnValue(Promise.resolve()),
    getUsers: jest.fn().mockReturnValue(Promise.resolve({
        data: [{
            label: '__user1__',
            value: '__userId1__'
        }, {
            label: '__user2__',
            value: '__userId2__'
        }]
    }))
}));

const getTeamSpy = jest.spyOn(TeamsService, 'getTeam');
const getTeamMembersSpy = jest.spyOn(TeamsService, 'getTeamMembers');
const getUnitForTeamSpy = jest.spyOn(TeamsService, 'getUnitForTeam');
const deleteUserFromTeamSpy = jest.spyOn(UsersService, 'deleteUserFromTeam');
const useReducerSpy = jest.spyOn(React, 'useReducer');
const useErrorSpy = jest.spyOn(useError, 'default');
const setMessageSpy = jest.fn();
const clearErrorsSpy = jest.fn();
let hasOneOfRoles = jest.fn();
let hasRole = jest.fn();
let wrapper: RenderResult;

const renderComponent = () => {
    const OUTER = shallow(<TeamView history={history} location={location} match={match} />);
    const Page = OUTER.props().children;
    return render(
        <MemoryRouter><Page hasOneOfRoles={hasOneOfRoles} hasRole={hasRole}></Page></MemoryRouter>
    );
};

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
        teamMembersLoaded: true,
        teamMembers: [{
            label: '__user1__',
            value: '__userId1__'
        }, {
            label: '__user2__',
            value: '__userId2__'
        }],
        teamName: '__teamName__',
        unitName: '__unit1__',
        active: true
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the teamView component is mounted with RENAME_TEAM role', () => {
    beforeAll(() => {
        hasOneOfRoles = jest.fn().mockImplementation((roles: string[]) => {
            return true;
        });
    });

    it('should render with default props', async () => {
        expect.assertions(4);

        expect(getTeamSpy).toHaveBeenCalled();
        expect(getTeamMembersSpy).toHaveBeenCalled();
        expect(getUnitForTeamSpy).toHaveBeenCalled();
        expect(wrapper.container).toMatchSnapshot();
    });
});

describe('when the teamView component has an inactive Team', () => {
    beforeEach(() => {
        useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
        useReducerSpy.mockImplementationOnce(() => [{ ...mockState, active: false }, jest.fn()]);

        hasOneOfRoles = jest.fn().mockImplementation((roles: string[]) => {
            return true;
        });
    });

    it('should show options to reactivate if the user has ACTIVATE_TEAM role', async () => {
        hasRole = jest.fn().mockImplementation(() => {
            return true;
        });

        act(() => {
            wrapper = renderComponent();
        });

        expect(wrapper.container).toMatchSnapshot();
    });

    it('should not show options to reactivate if the user does not have ACTIVATE_TEAM role', async () => {
        hasRole = jest.fn().mockImplementation((role) => {
            if (role === 'ACTIVATE_TEAM') {
                return false;
            }
            return true;
        });

        act(() => {
            wrapper = renderComponent();
        });

        expect(wrapper.container).toMatchSnapshot();
    });
});

describe('when the teamView component has an active Team', () => {
    beforeEach(() => {
        useReducerSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
        useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);

        hasOneOfRoles = jest.fn().mockImplementation((roles: string[]) => {
            return true;
        });
    });

    it('should show options to deactivate if the user has DEACTIVATE_TEAM role', async () => {
        hasRole = jest.fn().mockImplementation(() => {
            return true;
        });

        act(() => {
            wrapper = renderComponent();
        });

        expect(wrapper.container).toMatchSnapshot();
    });

    it('should not show options to deactivate if the user does not have DEACTIVATE_TEAM role', async () => {
        hasRole = jest.fn().mockImplementation((role: string) => {
            if (role === 'DEACTIVATE_TEAM') {
                return false;
            }
            return true;
        });

        act(() => {
            wrapper = renderComponent();
        });

        expect(wrapper.container).toMatchSnapshot();
    });
});

describe('when the teamView component is mounted without RENAME_TEAM role', () => {
    beforeAll(() => {
        hasOneOfRoles = jest.fn().mockImplementation((roles: string[]) => {
            return true;
        });
    });

    it('should render with default props', async () => {
        expect.assertions(4);

        expect(getTeamSpy).toHaveBeenCalled();
        expect(getTeamMembersSpy).toHaveBeenCalled();
        expect(getUnitForTeamSpy).toHaveBeenCalled();
        expect(wrapper.container).toMatchSnapshot();
    });
});

describe('when the Add team members button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();


        const addTeamMembersButton = getByText(wrapper.container, 'Add team members');
        fireEvent.click(addTeamMembersButton);


        expect(history.push).toHaveBeenCalledWith('/team/__teamId__/add-users');
    });
});

describe('when the remove user button is clicked', () => {
    it('should remove the row from the users table', async () => {
        await wait(async () => {
            const selectedUser = getByText(wrapper.container, '__user1__');
            const row = (selectedUser.closest('tr'));
            const removeButton = getByText(row as HTMLElement, 'Remove');
            fireEvent.click(removeButton);
        });

        expect(deleteUserFromTeamSpy).nthCalledWith(1, '__userId1__', '__teamId__');
        expect(getTeamMembersSpy).nthCalledWith(1, '__teamId__');

    });

    describe('and the service call fails', () => {
        beforeEach(() => {
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

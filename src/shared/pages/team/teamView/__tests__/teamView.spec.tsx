import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult } from '@testing-library/react';
import TeamView from '../teamView';
import { State } from '../state';
import * as useError from '../../../../hooks/useError';
import { ApplicationProvider } from '../../../../contexts/application';

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

const useReducerSpy = jest.spyOn(React, 'useReducer');
const useErrorSpy = jest.spyOn(useError, 'default');
const setMessageSpy = jest.fn();
const clearErrorsSpy = jest.fn();
let wrapper: RenderResult;

const renderComponent = (roles: string[] = []) => {
    const config = {
        csrf: '',
        layout: {
            body: { phaseBanner: { feedback: '', isVisible: true, phase: '' } },
            countDownForSeconds: 5,
            defaultTimeoutSeconds: 10,
            footer: { isVisible: true, links: [] },
            header: {
                isVisible: true,
                service: 'service name',
                serviceLink: '',
            },
        },
        user: {
            roles: roles
        }
    };
    return render(
        <ApplicationProvider config={config}>
            <MemoryRouter>
                <TeamView history={history} location={location} match={match} />
            </MemoryRouter>
        </ApplicationProvider>
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

    it('should render with default props', async () => {
        const roles = ['RENAME_TEAM'];

        act(() => {
            wrapper = renderComponent(roles);
        });
        expect(wrapper.container).toMatchSnapshot();
    });
});

describe('when the teamView component has an inactive Team', () => {
    beforeEach(() => {
        useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
        useReducerSpy.mockImplementationOnce(() => [{ ...mockState, active: false }, jest.fn()]);
    });

    it('should show options to reactivate if the user has ACTIVATE_TEAM role', async () => {
        const roles = ['RENAME_TEAM', 'ACTIVATE_TEAM'];

        act(() => {
            wrapper = renderComponent(roles);
        });

        expect(wrapper.container).toMatchSnapshot();
    });

    it('should not show options to reactivate if the user does not have ACTIVATE_TEAM role', async () => {
        const roles = ['RENAME_TEAM'];

        act(() => {
            wrapper = renderComponent(roles);
        });

        expect(wrapper.container).toMatchSnapshot();
    });
});

describe('when the teamView component has an active Team', () => {
    beforeEach(() => {
        useReducerSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
        useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    });

    it('should show options to deactivate if the user has DEACTIVATE_TEAM role', async () => {
        const roles = ['RENAME_TEAM', 'DEACTIVATE_TEAM'];
        act(() => {
            wrapper = renderComponent(roles);
        });

        expect(wrapper.container).toMatchSnapshot();
    });

    it('should not show options to deactivate if the user does not have DEACTIVATE_TEAM role', async () => {
        const roles = ['RENAME_TEAM'];
        act(() => {
            wrapper = renderComponent(roles);
        });

        expect(wrapper.container).toMatchSnapshot();
    });
});

describe('when the teamView component is mounted without RENAME_TEAM role', () => {

    it('should render with default props', async () => {
        expect(wrapper.container).toMatchSnapshot();
    });
});

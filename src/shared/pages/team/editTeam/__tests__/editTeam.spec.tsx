import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, wait, fireEvent, waitForElement } from '@testing-library/react';
import EditTeam from '../editTeam';
import * as TeamsService from '../../../../services/teamsService';
import {
    GENERAL_ERROR_TITLE,
    LOAD_TEAM_ERROR_DESCRIPTION,
    TEAM_UPDATE_FAILED_UNKNOWN_ERROR
} from '../../../../models/constants';
import * as useError from '../../../../hooks/useError';
import { State } from '../state';
import { shallow } from 'enzyme';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;
let wrapper: RenderResult;

const hasRole = jest.fn();

const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => {
    const OUTER = shallow(<EditTeam history={history} location={location} match={match} />);
    const Page = OUTER.props().children;

    return render(
        <MemoryRouter>
            <Page hasRole={hasRole}></Page>
        </MemoryRouter>
    );
};

jest.spyOn(TeamsService, 'getTeam').mockImplementation(() => Promise.resolve({
    active: true,
    displayName: '__displayName__',
    letterName: '__letterName__',
    permissions: [],
    type: '__type__'
}));

const updateTeamMock = jest.spyOn(TeamsService, 'updateTeam').mockImplementation(() => Promise.resolve(200));

const setDefaults = () => {
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
        currentDisplayName: '',
        newDisplayName: ''
    };
    useReducerSpy.mockImplementation(() => [mockState, reducerDispatch]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorSpy, clearErrorsSpy, setMessageSpy]);
    history.push = jest.fn();
    reducerDispatch.mockReset();
    addFormErrorSpy.mockReset();
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();

};

beforeEach(() => {
    setDefaults();

    hasRole.mockImplementation((role: string) => {
        if ((role === 'RENAME_TEAM') || (role === 'REASSIGN_TEAM_UNIT')) {
            return true;
        }
        return false;
    });

    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the editTeam component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should hide the edit name area if the user does not have the RENAME_TEAM role', async () => {
        setDefaults();

        hasRole.mockImplementation((role: string) => {
            if (role === 'RENAME_TEAM') {
                return false;
            }
            return true;
        });

        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should hide the change unit area if the user does not have the REASSIGN_TEAM_UNIT role', async () => {
        setDefaults();

        hasRole.mockImplementation((role: string) => {
            if (role === 'RENAME_TEAM') {
                return true;
            }
            return false;
        });

        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should hide the change unit area if the user does not have the SET_UNIT_ACTIVE_FLAG role', async () => {
        setDefaults();

        hasRole.mockImplementation((role: string) => {
            if (role === 'SET_UNIT_ACTIVE_FLAG') {
                return false;
            }
            return true;
        });

        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    describe('and the getTeam service fails', () => {
        beforeAll(() => {
            jest.spyOn(TeamsService, 'getTeam').mockImplementationOnce(() => Promise.reject());
        });

        it('should set the error state', () => {
            expect(setMessageSpy).toHaveBeenCalledWith({ description: LOAD_TEAM_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE });
        });
    });
});

describe('when the name is entered', () => {
    it('should be persisted in the page state', async () => {
        expect.assertions(1);

        const nameElement = await waitForElement(async () => {
            return await wrapper.findByLabelText('New team name');
        });

        fireEvent.change(nameElement, { target: { name: 'newTeamName', value: '__displayTitle__' } });

        await wait(() => {
            expect(reducerDispatch).toHaveBeenCalledWith({ type: 'SetNewTeamName', payload: '__displayTitle__' });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the unit has been changed', () => {
        beforeEach(async () => {
            mockState.currentDisplayName = '__currentDisplayName__';
            mockState.newDisplayName = '__currentDisplayName__';

            mockState.initialUnit = { label: '__unit1__', value: '__unit1_uuid__' };
            mockState.unit = { label: '__unit2__', value: '__unit2_uuid__' };
            updateTeamMock.mockClear();

            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Update');
            });

            fireEvent.click(submitButton);
        });

        describe( 'and the updateTeamUnit service call fails', () => {
            beforeAll(() => {
                jest.spyOn(TeamsService, 'updateTeam')
                    .mockImplementationOnce(() => Promise.reject({ response: { status: 500, data: {} } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: TEAM_UPDATE_FAILED_UNKNOWN_ERROR, title: GENERAL_ERROR_TITLE });
            });

            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });

        it('should redirect to the team view page', async () => {
            expect.assertions(1);

            await wait(() => {
                expect(history.push).toHaveBeenCalledWith('/team-view/__teamId__', { successMessage: 'Team unit changed from __unit1__ to __unit2__.' });
            });
        });

        it('should call the api to update the unit', async () => {
            expect.assertions(1);

            expect(updateTeamMock).toHaveBeenCalledTimes(1);
        });

        it('should call the begin update action', async () => {
            expect.assertions(1);

            await wait(() => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
    });

    describe('and the name has been changed', () => {

        beforeEach(async () => {
            mockState.currentDisplayName = '__currentDisplayName__';
            mockState.newDisplayName = '__newDisplayName__';

            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Update');
            });

            fireEvent.click(submitButton);
        });

        describe('and the updateTeamName service call is successful', () => {
            it('should redirect to the team view page', async () => {
                expect.assertions(1);

                await wait(() => {
                    expect(history.push).toHaveBeenCalledWith('/team-view/__teamId__', { successMessage: 'Team name changed from __currentDisplayName__ to __newDisplayName__.' });
                });
            });

            it('should call the begin update action', async () => {
                expect.assertions(1);

                await wait(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });

        describe('and the updateTeamName service call fails', () => {
            beforeAll(() => {
                jest.spyOn(TeamsService, 'updateTeam').mockImplementationOnce(() => Promise.reject({ response: { status: 500, data: {} } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: TEAM_UPDATE_FAILED_UNKNOWN_ERROR, title: GENERAL_ERROR_TITLE });
            });

            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
        describe('and the updateTeamName service call fails with a 409', () => {
            beforeAll(() => {
                jest.spyOn(TeamsService, 'updateTeam').mockImplementationOnce(() =>
                    Promise.reject({ response: { status: 409, data: { body: 'Name already exists' } } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith(
                    { description: 'Name already exists', title: GENERAL_ERROR_TITLE });
            });
        });
    });
    describe('and the name is unchanged', () => {
        beforeEach(async () => {
            mockState.currentDisplayName = '__currentDisplayName__';
            mockState.newDisplayName = '__currentDisplayName__';
            updateTeamMock.mockReset();

            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Update');
            });

            fireEvent.click(submitButton);
        });

        it('should not make an update name call', () => {
            expect(TeamsService.updateTeam).toHaveBeenCalledTimes(0);
        });
    });

    describe('and the name is not filled in', () => {
        beforeEach(async () => {
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Update');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'newDisplayName', value: 'The new team name is required' });
        });
    });
});
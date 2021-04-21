
import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, wait, fireEvent, waitForElement } from '@testing-library/react';
import EditTeam from '../editTeam';
import * as TeamsService from '../../../../services/teamsService';
import { GENERAL_ERROR_TITLE, LOAD_TEAM_ERROR_DESCRIPTION, TEAM_RENAME_FAILED_NAME_ALREADY_EXISTS, TEAM_RENAME_FAILED_UNKNOWN_ERROR } from '../../../../models/constants';
import * as useError from '../../../../hooks/useError';
import { State } from '../state';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;
let wrapper: RenderResult;

const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <EditTeam history={history} location={location} match={match}></EditTeam>
    </MemoryRouter>
);

jest.spyOn(TeamsService, 'getTeam').mockImplementation(() => Promise.resolve({
    active: true,
    displayName: '__displayName__',
    letterName: '__letterName__',
    permissions: [],
    type: '__type__'
}));
jest.spyOn(TeamsService, 'updateTeamName').mockImplementation(() => Promise.resolve(200));

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
    describe('and the data is filled in', () => {

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
                jest.spyOn(TeamsService, 'updateTeamName').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: TEAM_RENAME_FAILED_UNKNOWN_ERROR, title: GENERAL_ERROR_TITLE });
            });

            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
        describe('and the updateTeamName service call fails with a 409', () => {
            beforeAll(() => {
                jest.spyOn(TeamsService, 'updateTeamName').mockImplementationOnce(() => Promise.reject({ response: { status: 409 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: TEAM_RENAME_FAILED_NAME_ALREADY_EXISTS, title: GENERAL_ERROR_TITLE });
            });
        });
    });
    describe('and the data is not filled in', () => {
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

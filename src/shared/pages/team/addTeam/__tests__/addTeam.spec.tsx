import { act, fireEvent, getByText, render, RenderResult, waitFor } from '@testing-library/react';
import { match, MemoryRouter } from 'react-router-dom';
import React from 'react';
import WrappedAddTeam from '../addTeam';
import { createBrowserHistory, History, Location } from 'history';
import * as UnitsService from '../../../../services/unitsService';
import * as useError from '../../../../hooks/useError';
import { State } from '../state';
import {
    GENERAL_ERROR_TITLE, LOAD_UNITS_ERROR_DESCRIPTION,
    TEAM_CREATION_FAILURE_NAME_ALREADY_EXISTS, TEAM_CREATION_FAILURE_UNKNOWN_ERROR,
    VALIDATION_ERROR_TITLE
} from '../../../../models/constants';
import Unit from '../../../../models/unit';
import * as TeamsService from '../../../../services/teamsService';
import * as Validation from '../../../../validation';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

const renderComponent = () => render(
    <MemoryRouter>
        <WrappedAddTeam history={history}  location={location} match={match}/>
    </MemoryRouter>
);

const getUnitsSpy = jest.spyOn(UnitsService, 'getUnits');
const getAddTeamSpy = jest.spyOn(TeamsService, 'addTeam');
const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();
const validateSpy: jest.SpyInstance = jest.spyOn(Validation, 'validate');

const mockUnits: Unit = {
    displayName: '__someDisplayName1__',
    shortCode: '__someShortCode',
    type: '__someType__',
    value: '__someValue__'
};

beforeEach(() => {
    history = createBrowserHistory();
    location = {
        hash: '',
        key: '',
        pathname: '',
        search: '',
        state: {}
    };
    mockState = {
        team: {
            displayName: '',
            permissions: [
                {
                    accessLevel: 'OWNER',
                    caseTypeCode: ''
                }
            ],
            letterName: '',
            type: '',
            active: true,
            unitUUID: ''
        }
    };

    useReducerSpy.mockImplementation(() => [mockState, reducerDispatch]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorSpy, clearErrorsSpy, setMessageSpy]);
    reducerDispatch.mockReset();
    addFormErrorSpy.mockReset();
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the AddTeam component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(3);
        let wrapper: RenderResult;

        const expectedInitialState: State = {
            team: {
                displayName: '',
                permissions: [
                    {
                        accessLevel: 'OWNER',
                        caseTypeCode: ''
                    }
                ],
                letterName: '',
                type: '',
                active: true,
                unitUUID: ''
            }
        };

        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(mockState).toEqual(expectedInitialState);
            expect(getUnitsSpy).toHaveBeenCalledTimes(1);
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should return an error if the call to retrieve the units fail', async () => {
        expect.assertions(2);
        getUnitsSpy.mockImplementation(() => Promise.reject('error'));

        renderComponent();
        await waitFor(() => {
            expect(setMessageSpy).toBeCalledWith(
                { title: GENERAL_ERROR_TITLE, description: LOAD_UNITS_ERROR_DESCRIPTION }
            );
        });

    });

    it('should return a success message if team creation is successful', async () => {
        expect.assertions(1);
        let wrapper: RenderResult;
        getUnitsSpy.mockImplementation(() => Promise.resolve([mockUnits]));
        getAddTeamSpy.mockImplementationOnce(() => Promise.resolve({ response: { status: 200 } }));
        validateSpy.mockReturnValue(true);

        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const submitButton = getByText(wrapper.container, 'Add');
            fireEvent.click(submitButton);
        });
        await waitFor(() => {
            expect(history.location.state).toEqual({ successMessage: 'The team was created successfully.' });
        });

    });

    it('should set the correct error message if AddTeam returns a 409 response', async () => {
        expect.assertions(1);
        let wrapper: RenderResult;
        getUnitsSpy.mockImplementation(() => Promise.resolve([mockUnits]));
        getAddTeamSpy.mockImplementationOnce(() => Promise.reject({ response: { status: 409 } }));
        validateSpy.mockReturnValue(true);

        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const submitButton = getByText(wrapper.container, 'Add');
            fireEvent.click(submitButton);
        });
        await waitFor(() => {
            expect(setMessageSpy).toBeCalledWith(
                { title: VALIDATION_ERROR_TITLE, description: TEAM_CREATION_FAILURE_NAME_ALREADY_EXISTS }
            );
        });
    });

    it('should set the correct error message if AddTeam fails for an unknown reason', async () => {
        expect.assertions(1);
        let wrapper: RenderResult;
        getUnitsSpy.mockImplementation(() => Promise.resolve([mockUnits]));
        getAddTeamSpy.mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));
        validateSpy.mockReturnValue(true);

        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const submitButton = getByText(wrapper.container, 'Add');
            fireEvent.click(submitButton);
        });
        await waitFor(() => {
            expect(setMessageSpy).toBeCalledWith(
                { title: GENERAL_ERROR_TITLE, description: TEAM_CREATION_FAILURE_UNKNOWN_ERROR }
            );
        });
    });
});

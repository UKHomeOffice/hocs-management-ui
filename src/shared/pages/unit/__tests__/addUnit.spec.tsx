
import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, fireEvent, waitFor } from '@testing-library/react';
import AddUnit from '../addUnit';
import * as UnitsService from '../../../services/unitsService';
import { ADD_UNIT_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE, DUPLICATE_UNIT_DESCRIPTION, VALIDATION_ERROR_TITLE } from '../../../models/constants';
import Unit from '../../../models/unit';
import * as useError from '../../../hooks/useError';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockUnit: Unit;
let wrapper: RenderResult;

const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <AddUnit history={history} location={location} match={match}></AddUnit>
    </MemoryRouter>
);

jest.spyOn(UnitsService, 'createUnit').mockImplementation(() => Promise.resolve());

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
    mockUnit = {
        displayName: '',
        shortCode: '',
        value: '',
        type: ''
    };
    useReducerSpy.mockImplementation(() => [mockUnit, reducerDispatch]);
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

describe('when the addUnit component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the display name is entered', () => {
    it('should be persisted in the page state', async () => {
        expect.assertions(1);

        const displayNameElement = await waitFor(async () => {
            return await wrapper.findByLabelText('Display Name');
        });

        fireEvent.change(displayNameElement, { target: { name: 'displayName', value: '__displayName__' } });

        await waitFor(() => {
            expect(reducerDispatch).toHaveBeenCalledWith({ name: 'displayName', value: '__displayName__' });
        });
    });
});

describe('when the short code is entered', () => {
    it('should be persisted in the page state', async () => {
        expect.assertions(1);

        const shortCodeElement = await waitFor(async () => {
            return await wrapper.findByLabelText('Short Code');
        });

        fireEvent.change(shortCodeElement, { target: { name: 'shortCode', value: '__shortCode__' } });

        await waitFor(() => {
            expect(reducerDispatch).toHaveBeenCalledWith({ name: 'shortCode', value: '__shortCode__' });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockUnit.displayName = '__displayName__';
            mockUnit.shortCode = '__shortCode__';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {
                expect.assertions(1);

                await waitFor(() => {
                    expect(history.push).toHaveBeenCalledWith('/', { successMessage: 'The unit was added successfully' });
                });
            });
            it('should call the begin submit action', async () => {
                expect.assertions(1);

                await waitFor(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });

        describe('and the service call fails', () => {
            beforeAll(() => {
                jest.spyOn(UnitsService, 'createUnit').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: ADD_UNIT_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE });
            });
            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
        describe('and the service call fails with a 409', () => {
            beforeAll(() => {
                jest.spyOn(UnitsService, 'createUnit').mockImplementationOnce(() => Promise.reject({ response: { status: 409 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: DUPLICATE_UNIT_DESCRIPTION, title: VALIDATION_ERROR_TITLE });
            });
        });
    });
    describe('and the data is not filled in', () => {
        beforeEach(async () => {
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'displayName', value: 'The Display Name is required' });
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(2, { key: 'shortCode', value: 'The Short Code is required' });
        });
    });
});

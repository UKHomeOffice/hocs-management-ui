
import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, waitFor, fireEvent } from '@testing-library/react';
import { GENERAL_ERROR_TITLE, LOAD_USER_ERROR_DESCRIPTION, AMEND_USER_ERROR_DESCRIPTION, AMEND_USER_ERROR_TITLE, AMEND_USER_BAD_REQUEST_TITLE } from '../../../../models/constants';
import AmendUser from '../amendUser';
import * as useError from '../../../../hooks/useError';
import State from '../state';
import * as UsersService from '../../../../services/usersService';

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
const userId = 'xx-xx-xx-xx';

const renderComponent = () => render(
    <MemoryRouter>
        <AmendUser history={history} location={location} match={match}/>
    </MemoryRouter>
);
const getUserSpy = jest.spyOn(UsersService, 'getUser');
const updateUserSpy = jest.spyOn(UsersService, 'updateUser');
beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: { userUUID: userId },
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
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        enabled: 'true'
    };

    getUserSpy.mockImplementation(() => Promise.resolve({ id: 'id', username: 'un', email: 'email', firstName: 'testSimpleName', lastName: 'testTitle', uuid: 'testUUID', enabled: true }));
    updateUserSpy.mockImplementation(() => Promise.resolve());
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

describe('when the AmendUser component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(7);
        wrapper = renderComponent();
        await waitFor(() => {
            expect(getUserSpy).toHaveBeenCalled();
            expect(reducerDispatch).toHaveBeenNthCalledWith(1, { name: 'username', value: 'un' });
            expect(reducerDispatch).toHaveBeenNthCalledWith(2, { name: 'email', value: 'email' });
            expect(reducerDispatch).toHaveBeenNthCalledWith(3, { name: 'firstName', value: 'testSimpleName' });
            expect(reducerDispatch).toHaveBeenNthCalledWith(4, { name: 'lastName', value: 'testTitle' });
            expect(reducerDispatch).toHaveBeenNthCalledWith(5, { name: 'enabled', value: 'true' });
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should display an error if the call to retrieve item details fails', async () => {
        expect.assertions(2);
        getUserSpy.mockImplementation(() => Promise.reject('error'));
        wrapper = renderComponent();
        await waitFor(() => {
            expect(setMessageSpy).toBeCalledWith({ title: GENERAL_ERROR_TITLE, description: LOAD_USER_ERROR_DESCRIPTION });
        });

    });
});

describe('when the new first name is entered', () => {
    it('should be persisted in the page state', async () => {
        wrapper = renderComponent();
        getUserSpy.mockReturnValueOnce(Promise.resolve(
            { id: 'id', username: 'un', email: 'email', firstName: 'testSimpleName', lastName: 'testTitle', uuid: 'testUUID', enabled: true }
        ));
        const nameElement = await waitFor(async () => {
            return await wrapper.findByLabelText('First Name');
        });
        const newFirstName = 'Xyz';
        fireEvent.change(nameElement, { target: { name: 'firstName', value: newFirstName } });
        await waitFor(() => {
            expect(reducerDispatch).toHaveBeenCalledWith({ name: 'firstName', value: newFirstName });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockState.firstName = 'firstname';
            mockState.lastName = 'lastname';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {

                getUserSpy.mockReturnValueOnce(Promise.resolve(
                    { id: 'id', username: 'un', email: 'email', firstName: 'testSimpleName', lastName: 'testTitle', uuid: 'testUUID', enabled: true }
                ));
                await waitFor(() => {
                    expect(getUserSpy).toHaveBeenCalled();
                    expect(updateUserSpy).toHaveBeenCalled();
                    expect(history.push).toHaveBeenCalledWith(`/user-view/${userId}`, { successMessage: 'The user was amended successfully' });
                });
            });
            it('should call the begin submit action', async () => {

                await waitFor(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });
    });
    describe('and the data is not filled in', () => {
        beforeEach(async () => {
            updateUserSpy.mockReturnValueOnce(Promise.resolve(
                { id: 'id', username: 'un', email: 'email', firstName: '', lastName: 'testTitle', uuid: 'testUUID', enabled: true }
            ));
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'firstName', value: 'The First Name is required' });
        });
    });

    describe('and the data is filled in', () => {

        beforeEach(async () => {
            updateUserSpy.mockReset();
            updateUserSpy.mockImplementation(() => Promise.reject({ response: { status: 500 } }));
            mockState.firstName = 'firstname';
            mockState.lastName = 'lastname';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call fails', () => {

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: AMEND_USER_ERROR_DESCRIPTION, title: AMEND_USER_ERROR_TITLE });
            });

            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
    });

    describe('and the data is filled in with invalid data', () => {

        const errorMessage = 'errMsg';

        beforeEach(async () => {
            updateUserSpy.mockReset();
            updateUserSpy.mockImplementation(() => Promise.reject({ response: { status: 400, data: { message: errorMessage } } }));
            mockState.firstName = 'firstname';
            mockState.lastName = 'lastname';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call fails with a bad request', () => {

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: errorMessage, title: AMEND_USER_BAD_REQUEST_TITLE });
            });

            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
    });
});

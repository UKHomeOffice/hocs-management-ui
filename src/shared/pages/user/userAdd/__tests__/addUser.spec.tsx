import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, fireEvent, waitFor } from '@testing-library/react';
import AddUser from '../addUser';
import * as UsersService from '../../../../services/usersService';
import { ADD_USER_BAD_REQUEST_TITLE, ADD_USER_ERROR_DESCRIPTION, ADD_USER_ERROR_TITLE } from '../../../../models/constants';
import { User } from '../../../../models/user';
import * as useError from '../../../../hooks/useError';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockUser: User;
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
        <AddUser history={history} location={location} match={match}/>
    </MemoryRouter>
);

jest.spyOn(UsersService, 'addUser').mockImplementation(() => Promise.resolve(userId));

beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: {},
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
    mockUser = {
        id: userId,
        username: 'un',
        email: '',
        firstName: '',
        lastName: '',
        enabled: true
    };
    useReducerSpy.mockImplementation(() => [mockUser, reducerDispatch]);
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

describe('when the addUser component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockUser.email = 'firstname@example.com';
            mockUser.firstName = 'firstname';
            mockUser.lastName = 'lastname';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the view user page', async () => {
                expect.assertions(1);

                await waitFor(() => {
                    expect(history.push).toHaveBeenCalledWith(`/user-view/${userId}`, { successMessage: 'User added successfully' });
                });
            });
            it('should clear any previous errors', async () => {
                expect.assertions(1);

                await waitFor(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });

        describe('and the service call fails', () => {
            beforeAll(() => {
                jest.spyOn(UsersService, 'addUser').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: ADD_USER_ERROR_DESCRIPTION, title: ADD_USER_ERROR_TITLE });
            });

            it('should clear any previous errors', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });

        describe('and the service call fails with a bad request', () => {
            const errorMessage = 'errMsg';
            beforeAll(() => {
                jest.spyOn(UsersService, 'addUser').mockImplementationOnce(() => Promise.reject({ response: { status: 400, data: { message: errorMessage } } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: errorMessage, title: ADD_USER_BAD_REQUEST_TITLE });
            });

            it('should clear any previous errors', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
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
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'email', value: 'The Email Address is required' });
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(2, { key: 'firstName', value: 'The First Name is required' });
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(3, { key: 'lastName', value: 'The Last Name is required' });
        });
    });
    describe('and the email is not valid', () => {
        beforeEach(async () => {
            mockUser.email = 'dsfd';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });
            fireEvent.click(submitButton);
        });

        it('should show the validation message', () => {
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'email', value: 'Email Address must be a valid email' });
        });
    });
});

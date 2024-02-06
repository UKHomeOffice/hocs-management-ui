
import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, fireEvent, waitFor } from '@testing-library/react';
import AddBusinessRep from '../addBusinessRep';
import * as EntityListService from '../../../../services/entityListService';
import { ADD_EXGRATIA_BUS_REP_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE, DUPLICATE_REPRESENTATIVE_DESCRIPTION, VALIDATION_ERROR_TITLE } from '../../../../models/constants';
import EntityListItem from '../../../../models/entityListItem';
import * as useError from '../../../../hooks/useError';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockEntityListItem: EntityListItem;
let wrapper: RenderResult;

const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <AddBusinessRep history={history} location={location} match={match}></AddBusinessRep>
    </MemoryRouter>
);

jest.spyOn(EntityListService, 'createListItem').mockImplementation(() => Promise.resolve());

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
    mockEntityListItem = {
        title: '',
        simpleName: '',
        uuid: '' ,
        active: false
    };
    useReducerSpy.mockImplementation(() => [mockEntityListItem, reducerDispatch]);
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

describe('when the addRepresentative component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the name is entered', () => {
    it('should be persisted in the page state', async () => {
        expect.assertions(1);

        const nameElement = await waitFor(async () => {
            return await wrapper.findByLabelText('Representative name');
        });

        fireEvent.change(nameElement, { target: { name: 'title', value: '__displayTitle__' } });

        await waitFor(() => {
            expect(reducerDispatch).toHaveBeenCalledWith({ name: 'title', value: '__displayTitle__' });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockEntityListItem.title = '__displayName__';
            mockEntityListItem.simpleName = '__shortCode__';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {
                expect.assertions(1);

                await waitFor(() => {
                    expect(history.push).toHaveBeenCalledWith('/', { successMessage: 'The representative was added successfully' });
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
                jest.spyOn(EntityListService, 'createListItem').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: ADD_EXGRATIA_BUS_REP_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE });
            });
            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
        describe('and the service call fails with a 409', () => {
            beforeAll(() => {
                jest.spyOn(EntityListService, 'createListItem').mockImplementationOnce(() => Promise.reject({ response: { status: 409 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: DUPLICATE_REPRESENTATIVE_DESCRIPTION, title: VALIDATION_ERROR_TITLE });
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
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'title', value: 'The Representative name is required' });
        });
    });
});

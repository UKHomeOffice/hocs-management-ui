import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, fireEvent, waitFor } from '@testing-library/react';
import {
    GENERAL_ERROR_TITLE
} from '../../../../models/constants';
import AmendEntity from '../amendEntity';
import * as EntityListService from '../../../../services/entityListService';
import * as useError from '../../../../hooks/useError';
import { State } from '../amendEntityState';

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

const entityDescription: EntityDefinition  = {
    entityListName: 'ENTITIES',
    entityNamePlural: 'entities',
    entityName: 'entity',
    entityNameCapitalised: 'Entity',
    entityRoute: '/manage-entities',
    messages: {
        LOAD_ENTITIES_ERROR: 'There was an error retrieving the entities. Please try refreshing the page.',
        AMEND_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while amending the entity. Please try again.',
        AMEND_ENTITY_SUCCESS: 'The entity was amended successfully',
        ADD_ENTITY_SUCCESS: 'The entity was added successfully',
        DUPLICATE_ENTITY_ERROR_DESCRIPTION: 'An entity with those details already exists',
        ADD_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while adding the entity. Please try again.'
    }
};

const Component = AmendEntity(entityDescription);

const renderComponent = () => render(
    <MemoryRouter>
        <Component history={history} location={location} match={match}></Component>
    </MemoryRouter>
);
const getItemDetailsSpy = jest.spyOn(EntityListService, 'getItemDetails');
const updateListItemSpy = jest.spyOn(EntityListService, 'updateListItem');
beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: { itemUUID: '__itemId__' },
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
        title: '',
        originalTitle: '',
        simpleName: '',
        uuid: '',
        active: false
    };

    getItemDetailsSpy.mockImplementation(() => Promise.resolve(
        { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID', active: false }));
    updateListItemSpy.mockImplementation(() => Promise.resolve());
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

describe('when the AmendEntity component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        wrapper = renderComponent();
        await waitFor(() => {
            expect(getItemDetailsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should initially render blank before item title is returned', async () => {
        getItemDetailsSpy.mockReturnValueOnce(Promise.resolve(
            { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID', active: false }
        ));
        mockState.originalTitle = '';
        const wrapper: RenderResult = renderComponent();
        expect(wrapper.container.outerHTML).toMatchSnapshot();
    });

    it('should display an error if the call to retrieve item details fails', async () => {
        expect.assertions(2);
        getItemDetailsSpy.mockImplementation(() => Promise.reject('error'));

        wrapper = renderComponent();

        await waitFor(() => {
            expect(setMessageSpy).toBeCalledWith({ title: GENERAL_ERROR_TITLE, description: 'There was an error retrieving the entities. Please try refreshing the page.' });
        });

    });
});

describe('when the new name is entered', () => {
    it('should be persisted in the page state', async () => {
        wrapper = renderComponent();
        getItemDetailsSpy.mockReturnValueOnce(Promise.resolve(
            { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID', active: false }
        ));
        const nameElement = await waitFor(async () => {
            return await wrapper.findByLabelText('New entity name');
        });

        fireEvent.change(nameElement, { target: { name: 'title', value: 'newTestEntityTitle' } });

        await waitFor(() => {

            expect(reducerDispatch).toHaveBeenCalledWith({ type: 'SetTitle', payload: 'newTestEntityTitle' });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockState.title = '__displayName__';
            mockState.simpleName = '__shortCode__';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {

                getItemDetailsSpy.mockReturnValueOnce(Promise.resolve(
                    { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID', active: false }
                ));
                await waitFor(() => {
                    expect(getItemDetailsSpy).toHaveBeenCalled();
                    expect(updateListItemSpy).toHaveBeenCalled();
                    expect(history.push).toHaveBeenCalledWith('/', { successMessage: 'The entity was amended successfully' });
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
            updateListItemSpy.mockReturnValueOnce(Promise.resolve(
                { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID' }
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
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1,
                { key: 'title', value: 'The New entity name is required' });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            updateListItemSpy.mockReset();
            updateListItemSpy.mockImplementation(() => Promise.reject({ response: { status: 500 } }));
            mockState.title = '__displayName__';
            mockState.simpleName = '__shortCode__';
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call fails', () => {
            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: 'Something went wrong while amending the entity. Please try again.', title: GENERAL_ERROR_TITLE });
            });

            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
    });
});

import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, waitFor, render, screen, fireEvent } from '@testing-library/react';
import EntityListView from '../entityListView';
import * as ListService from '../../../../services/entityListService';

let match: match<any>;
let history: History<any>;
let location: Location;

jest.mock('../../../../services/entityListService', () => ({
    __esModule: true,
    getListItems: jest.fn().mockReturnValue(Promise.resolve([{
        simpleName: 'testSimpleName1',
        uuid: 'testId1',
        title: 'testTitle1',
        active: true,
    }, {
        simpleName: 'testSimpleName2',
        uuid: 'testId2',
        title: 'testTitle2',
        active: false,
    }]
    ))
}));

const getListItemsSpy = jest.spyOn(ListService, 'getListItems');
const useReducerSpy = jest.spyOn(React, 'useReducer');
const setMessageSpy = jest.fn();
const clearErrorsSpy = jest.fn();

const listDefinition: EntityDefinition = {
    entityListName: 'ENTITIES',
    entityNamePlural: 'entities',
    entityName: 'entity',
    entityNameCapitalised: 'Entity',
    entityRoute: '/add-new-entity',
    messages: {
        LOAD_ENTITIES_ERROR: 'There was an error retrieving the entities. Please try refreshing the page.',
        AMEND_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while amending the entity. Please try again.',
        AMEND_ENTITY_SUCCESS: 'The entity was amended successfully',
        ADD_ENTITY_SUCCESS: 'The entity was added successfully',
        DUPLICATE_ENTITY_ERROR_DESCRIPTION: 'An entity with those details already exists',
        ADD_ENTITY_ERROR_DESCRIPTION: 'Something went wrong while adding the entity. Please try again.'
    }
};

const Component = EntityListView(listDefinition);

const renderComponent = () => render(
    <MemoryRouter>
        <Component history={history} location={location} match={match}></Component>
    </MemoryRouter>
);

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
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('when the entity list view is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(3);
        const wrapper = renderComponent();
        await waitFor(async () => await screen.findByText('Show inactive items'));

        await waitFor(() => {
            expect(getListItemsSpy).toHaveBeenCalled();
            expect(useReducerSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('toggling inactive items should show active column and all entities', async () => {
        expect.assertions(2);

        const wrapper = renderComponent();

        await waitFor(() => expect(getListItemsSpy).toHaveBeenCalled());

        await act(async () => {
            const link = await screen.findByText('Show inactive items');
            fireEvent.click(link);
        });

        await waitFor(() => screen.findByText('Hide inactive items'));

        expect(wrapper.container).toMatchSnapshot();
    });
});

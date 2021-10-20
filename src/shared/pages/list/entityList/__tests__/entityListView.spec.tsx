import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, wait, render, RenderResult } from '@testing-library/react';
import EntityListView from '../entityListView';
import * as ListService from '../../../../services/entityListService';
import * as useError from '../../../../hooks/useError';
import { State } from '../state';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

jest.mock('../../../../services/entityListService', () => ({
    __esModule: true,
    getListItems: jest.fn().mockReturnValue(Promise.resolve({
        data: [{
            simpleName: 'testSimpleName1',
            uuid: 'testId1',
            title: 'testTitle1'
        }, {
            simpleName: 'testSimpleName2',
            uuid: 'testId2',
            title: 'testTitle2'
        }]
    }))
}));

const getListItemsSpy = jest.spyOn(ListService, 'getListItems');
const useReducerSpy = jest.spyOn(React, 'useReducer');
const useErrorSpy = jest.spyOn(useError, 'default');
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
    mockState = {
        entitiesLoaded: true,
        entities: [{
            simpleName: 'testSimpleName1',
            uuid: 'testId1',
            title: 'testTitle1'
        }, {
            simpleName: 'testSimpleName2',
            uuid: 'testId2',
            title: 'testTitle2'
        }]
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the entity list view is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(getListItemsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

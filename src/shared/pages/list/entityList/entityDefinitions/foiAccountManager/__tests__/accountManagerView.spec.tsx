import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, waitFor, render, RenderResult } from '@testing-library/react';
import EntityListView from '../../../entityListView';
import * as ListService from '../../../../../../services/entityListService';
import { State } from '../../../state';
import * as useError from '../../../../../../hooks/useError';
import foiAccountManager from '../foiAccountManager';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

const FoiAccountManager = EntityListView(foiAccountManager);

jest.mock('../../../../../../services/entityListService', () => ({
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

const renderComponent = () => render(
    <MemoryRouter>
        <FoiAccountManager history={history} location={location} match={match}></FoiAccountManager>
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
    const entities = [{
        simpleName: 'testSimpleName1',
        uuid: 'testId1',
        title: 'testTitle1',
        active: true
    }, {
        simpleName: 'testSimpleName2',
        uuid: 'testId2',
        title: 'testTitle2',
        active: true
    }];
    mockState = {
        entitiesLoaded: true,
        entities,
        showInactive: true,
        inactiveCount: 0,
        entitiesToDisplay: entities,
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the foiAccountManager EntityListView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(getListItemsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

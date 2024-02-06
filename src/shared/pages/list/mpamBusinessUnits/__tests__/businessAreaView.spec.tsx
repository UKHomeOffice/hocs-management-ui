import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, waitFor, render, RenderResult, getByText, fireEvent } from '@testing-library/react';
import BusinessAreaView from '../businessAreaView';
import * as ListService from '../../../../services/entityListService';
import * as useError from '../../../../hooks/useError';

let match: match<any>;
let history: History<any>;
let location: Location;

jest.mock('../../../../services/entityListService', () => ({
    __esModule: true,
    getListItems: jest.fn().mockReturnValue(Promise.resolve([{
        simpleName: 'testSimpleName1',
        uuid: 'testId1',
        title: 'testTitle1',
        active: true
    }, {
        simpleName: 'testSimpleName2',
        uuid: 'testId2',
        title: 'testTitle2',
        active: true
    }]
    ))
}));

const getListItemsSpy = jest.spyOn(ListService, 'getListItems');
const useErrorSpy = jest.spyOn(useError, 'default');
const setMessageSpy = jest.fn();
const clearErrorsSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <BusinessAreaView history={history} location={location} match={match}></BusinessAreaView>
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
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the businessAreaView component is mounted', () => {
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

describe('when the Add Business Unit button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const addBusinessUnitButton = getByText(wrapper.container, 'Add Business Unit');

            fireEvent.click(addBusinessUnitButton);
        });

        expect(history.push).toHaveBeenCalledWith('/add-business-unit/undefined');
    });
});

import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, fireEvent, getByText, render, RenderResult, screen, waitFor } from '@testing-library/react';
import CompBusinessAreaView from '../compBusinessAreaView';
import * as ListService from '../../../../services/entityListService';
import * as useError from '../../../../hooks/useError';

let match: match<any>;
let history: History<any>;
let location: Location;

jest.mock('../../../../services/entityListService', () => ({
    __esModule: true,
    getListItems: jest.fn().mockReturnValue(Promise.resolve([
        {
            simpleName: 'testSimpleName1',
            uuid: 'testId1',
            title: 'testTitle1',
            active: true,
        }, {
            simpleName: 'testSimpleName2',
            uuid: 'testId2',
            title: 'testTitle2',
            active: false,
        }]))
}));

const getListItemsSpy = jest.spyOn(ListService, 'getListItems');
const useErrorSpy = jest.spyOn(useError, 'default');
const setMessageSpy = jest.fn();
const clearErrorsSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <CompBusinessAreaView history={history} location={location} match={match}></CompBusinessAreaView>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: { type: 'COMP_ASYLUM_AND_HUMAN_RIGHTS_BUS_AREA' },
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
        const wrapper = renderComponent();
        await waitFor(async () => await screen.findByText('Show inactive items'));

        await waitFor(() => {
            expect(getListItemsSpy).toHaveBeenCalled();
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

describe('when the Add Business Area button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const addBusinessAreaButton = getByText(wrapper.container, 'Add Business Area');

            fireEvent.click(addBusinessAreaButton);
        });

        expect(history.push).toHaveBeenCalledWith('/add-comp-business-area/COMP_ASYLUM_AND_HUMAN_RIGHTS_BUS_AREA');
    });
});

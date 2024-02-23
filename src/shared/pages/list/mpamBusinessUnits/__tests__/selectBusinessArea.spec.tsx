import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import SelectBusinessArea from '../selectBusinessArea';
import * as useError from '../../../../hooks/useError';

jest.mock('../../../../services/entityListService', () => ({
    __esModule: true,
    getListItems: () => Promise.resolve([{
        label: '__businessArea1__',
        value: '__businessAreaId1__'
    }, {
        label: '__businessArea2__',
        value: '__businessAreaId2__'
    }])
}));

let match: match<any>;
let history: History<any>;
let location: Location;
let wrapper: RenderResult;

const useStateSpy = jest.spyOn(React, 'useState');
const setSelectedCaseTypeMock = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorMock = jest.fn();
const clearErrorsMock = jest.fn();
const setMessageMock = jest.fn();
const mockSelectedBusinessArea = undefined;

const renderComponent = () => render(
    <MemoryRouter>
        <SelectBusinessArea history={history} location={location} match={match}></SelectBusinessArea>
    </MemoryRouter>
);

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

    useStateSpy.mockImplementation(() => [mockSelectedBusinessArea, setSelectedCaseTypeMock]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorMock, clearErrorsMock, setMessageMock]);
    history.push = jest.fn();
    addFormErrorMock.mockReset();
    clearErrorsMock.mockReset();
    setMessageMock.mockReset();
    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the selectBusinessArea component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
            console.log(wrapper.container);
        });
    });
});

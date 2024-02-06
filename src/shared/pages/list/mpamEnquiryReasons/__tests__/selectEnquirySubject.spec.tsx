import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import * as useError from '../../../../hooks/useError';
import SelectEnquirySubject from '../selectEnquirySubject';

jest.mock('../../../../services/entityListService', () => ({
    __esModule: true,
    getListItems: () => Promise.resolve([{
        label: '__enquirySubject1__',
        value: '__enquirySubjectId1__'
    }, {
        label: '__enquirySubject2__',
        value: '__enquirySubjectId2__'
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
const mockSelectedEnquirySubject = undefined;

const renderComponent = () => render(
    <MemoryRouter>
        <SelectEnquirySubject history={history} location={location} match={match}/>
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

    useStateSpy.mockImplementation(() => [mockSelectedEnquirySubject, setSelectedCaseTypeMock]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorMock, clearErrorsMock, setMessageMock]);
    history.push = jest.fn();
    addFormErrorMock.mockReset();
    clearErrorsMock.mockReset();
    setMessageMock.mockReset();
    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the selectEnquirySubject component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
            console.log(wrapper.container);
        });
    });
});

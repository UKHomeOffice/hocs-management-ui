import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, fireEvent, waitFor } from '@testing-library/react';
import SelectCaseType from '../selectCaseType';
import { GENERAL_ERROR_TITLE, LOAD_CASE_TYPES_DESCRIPTION } from '../../../models/constants';
import Item from '../../../models/item';
import * as useError from '../../../hooks/useError';
import * as CaseTypesService from '../../../services/caseTypesService';

jest.mock('../../../services/caseTypesService', () => ({
    __esModule: true,
    getCaseTypes: () => Promise.resolve([{
        label: '__caseType1__',
        value: '__CaseTypeId1__'
    }, {
        label: '__caseType2__',
        value: '__CaseTypeId2__'
    }])
}));

const getCaseTypesSpy = jest.spyOn(CaseTypesService, 'getCaseTypes');

let match: match<any>;
let history: History<any>;
let location: Location;
let wrapper: RenderResult;
let mockSelectedCaseType: Item | undefined;

const useStateSpy = jest.spyOn(React, 'useState');
const setSelectedCaseTypeMock = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorMock = jest.fn();
const clearErrorsMock = jest.fn();
const setMessageMock = jest.fn();
mockSelectedCaseType = undefined;

const renderComponent = () => render(
    <MemoryRouter>
        <SelectCaseType history={history} location={location} match={match}></SelectCaseType>
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

    useStateSpy.mockImplementation(() => [mockSelectedCaseType, setSelectedCaseTypeMock]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorMock, clearErrorsMock, setMessageMock]);
    history.push = jest.fn();
    addFormErrorMock.mockReset();
    clearErrorsMock.mockReset();
    setMessageMock.mockReset();
    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the selectCaseType component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should display an error if the call to retrieve the case types fail', async () => {
        expect.assertions(2);
        getCaseTypesSpy.mockImplementation(() => Promise.reject('error'));

        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(setMessageMock).toBeCalledWith({ title: GENERAL_ERROR_TITLE, description: LOAD_CASE_TYPES_DESCRIPTION });
        });

    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeAll(async () => {
            mockSelectedCaseType = {
                label: '__caseTypeLabel__',
                value: '__caseTypeValue__'
            };
        });

        beforeEach(async () => {
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should redirect to the home page', async () => {
            expect.assertions(1);

            await waitFor(() => {
                expect(history.push).toHaveBeenCalledWith('/case-type/__caseTypeValue__');
            });
        });
        it('should clear any previous errors', async () => {
            expect.assertions(1);

            await waitFor(() => {
                expect(clearErrorsMock).toHaveBeenCalled();
            });
        });
    });
    describe('and the data is not filled in', () => {

        beforeAll(async () => {
            mockSelectedCaseType = undefined;
        });
        beforeEach(async () => {
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsMock).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorMock).toHaveBeenNthCalledWith(1, { key: 'value', value: 'The Case Type is required' });
        });
    });
});

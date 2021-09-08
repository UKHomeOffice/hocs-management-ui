import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, wait, fireEvent, waitForElement } from '@testing-library/react';
import SelectBusinessArea from '../selectBusinessArea';
import Item from '../../../../models/item';
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
let mockSelectedBusinessArea: Item | undefined;

const useStateSpy = jest.spyOn(React, 'useState');
const setSelectedCaseTypeMock = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorMock = jest.fn();
const clearErrorsMock = jest.fn();
const setMessageMock = jest.fn();
mockSelectedBusinessArea = undefined;

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

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
            console.log(wrapper.container);
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeAll(async () => {
            mockSelectedBusinessArea = {
                label: '__businessAreaLabel__',
                value: '__businessAreaValue__'
            };
        });

        beforeEach(async () => {
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should redirect to the home page', async () => {
            expect.assertions(1);

            await wait(() => {
                expect(history.push).toHaveBeenCalledWith('/business-area/__businessAreaValue__');
            });
        });
        it('should clear any previous errors', async () => {
            expect.assertions(1);

            await wait(() => {
                expect(clearErrorsMock).toHaveBeenCalled();
            });
        });
    });

    describe('and the data is not filled in', () => {

        beforeAll(async () => {
            mockSelectedBusinessArea = undefined;
        });
        beforeEach(async () => {
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsMock).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorMock).toHaveBeenNthCalledWith(1, { key: 'value', value: 'The Business Area is required' });
        });
    });
});

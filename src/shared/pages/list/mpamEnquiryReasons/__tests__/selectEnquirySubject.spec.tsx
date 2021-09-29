import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, wait, fireEvent, waitForElement } from '@testing-library/react';
import Item from '../../../../models/item';
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
let mockSelectedEnquirySubject: Item | undefined;

const useStateSpy = jest.spyOn(React, 'useState');
const setSelectedCaseTypeMock = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorMock = jest.fn();
const clearErrorsMock = jest.fn();
const setMessageMock = jest.fn();
mockSelectedEnquirySubject = undefined;

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

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
            console.log(wrapper.container);
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeAll(async () => {
            mockSelectedEnquirySubject = {
                label: '__enquirySubjectLabel__',
                value: '__enquirySubjectValue__'
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
                expect(history.push).toHaveBeenCalledWith('/enquiry-subject/__enquirySubjectValue__');
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
            mockSelectedEnquirySubject = undefined;
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
            expect(addFormErrorMock).toHaveBeenNthCalledWith(1, { key: 'value', value: 'The Enquiry Subject is required' });
        });
    });
});

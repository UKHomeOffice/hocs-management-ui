import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, wait, fireEvent, waitForElement } from '@testing-library/react';
import AddStandardLine from '../addStandardLine';
import * as StandardLinesService from '../../../services/standardLinesService';
import { GENERAL_ERROR_TITLE, ADD_STANDARD_LINE_ERROR_DESCRIPTION, LOAD_TOPICS_ERROR_DESCRIPTION } from '../../../models/constants';
import StandardLine from '../../../models/standardLine';
import * as useError from '../../../hooks/useError';
import * as TopicsService from '../../../services/topicsService';
import { createMockFile } from '../../../../../test/createMockFile';
import { advanceTo } from 'jest-date-mock';

jest.mock('../../../services/topicsService', () => ({
    __esModule: true,
    getTopics: () => Promise.resolve([{
        label: '__topic1__',
        value: '__topicId1__'
    }, {
        label: '__topic2__',
        value: '__topicId2__'
    }])
}));

const getTopicsSpy = jest.spyOn(TopicsService, 'getTopics');

let match: match<any>;
let history: History<any>;
let location: Location;
let mockStandardLine: StandardLine;
let wrapper: RenderResult;

const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <AddStandardLine history={history} location={location} match={match}></AddStandardLine>
    </MemoryRouter>
);

jest.spyOn(StandardLinesService, 'addStandardLine').mockImplementation(() => Promise.resolve());

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
    mockStandardLine = {
        expiryDate: '',
        topic: undefined,
        files: undefined
    };
    useReducerSpy.mockImplementation(() => [mockStandardLine, reducerDispatch]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorSpy, clearErrorsSpy, setMessageSpy]);
    history.push = jest.fn();
    reducerDispatch.mockReset();
    addFormErrorSpy.mockReset();
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
    advanceTo(new Date(1640995200000)); // reset to date time.
    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the addStandardLine component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should display an error if the call to retrieve the parent topics fails', async () => {
        expect.assertions(1);
        getTopicsSpy.mockImplementation(() => Promise.reject('error'));

        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(setMessageSpy).toBeCalledWith({ title: GENERAL_ERROR_TITLE, description: LOAD_TOPICS_ERROR_DESCRIPTION });
        });

    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockStandardLine.expiryDate = '2101-01-01';
            mockStandardLine.files = [createMockFile()];
            mockStandardLine.topic = { label: '__topic__', value: '__value__' };
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {
                expect.assertions(1);

                await wait(() => {
                    expect(history.push).toHaveBeenCalledWith('/manage-standard-lines', { successMessage: 'The standard line was created successfully' });
                });
            });
            it('should clear any previous errors', async () => {
                expect.assertions(1);

                await wait(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });

        describe('and the service call fails', () => {
            beforeAll(() => {
                jest.spyOn(StandardLinesService, 'addStandardLine').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: ADD_STANDARD_LINE_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE });
            });

            it('should clear any previous errors', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
    });
    describe('and the data is not filled in', () => {
        beforeEach(async () => {
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'files', value: 'The Standard Line is required' });
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(2, { key: 'expiryDate', value: 'The Expiry Date is invalid' });
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(3, { key: 'topic', value: 'The Topic is required' });
        });
    });
    describe('and the expiry date is not in the future', () => {
        beforeEach(async () => {
            mockStandardLine.expiryDate = new Date().toDateString();
            mockStandardLine.files = [createMockFile()];
            mockStandardLine.topic = { label: '__topic__', value: '__value__' };
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });
            fireEvent.click(submitButton);
        });

        it('should show the validation message', () => {
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'expiryDate', value: 'The Expiry Date must be in the future' });
        });
    });
});

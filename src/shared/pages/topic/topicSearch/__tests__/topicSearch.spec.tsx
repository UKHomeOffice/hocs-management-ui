import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, waitFor, fireEvent, getByText, render, RenderResult } from '@testing-library/react';
import TopicSearch from '../topicSearch';
import * as TopicsService from '../../../../services/topicsService';
import * as useError from '../../../../hooks/useError';
import Item from '../../../../models/item';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: Item;

jest.mock('../../../../services/topicsService', () => ({
    __esModule: true,
    getTopics: jest.fn().mockReturnValue(Promise.resolve([{
        label: '__label__',
        value: '__value__'
    }, {
        label: '__label__',
        value: '__value__'
    }]))
}));

const getTopicsSpy = jest.spyOn(TopicsService, 'getTopics');
const useStateSpy = jest.spyOn(React, 'useState');
const useErrorSpy = jest.spyOn(useError, 'default');

const renderComponent = () => render(
    <MemoryRouter>
        <TopicSearch history={history} location={location} match={match}></TopicSearch>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    location = {
        hash: '',
        key: '',
        pathname: '',
        search: '',
        state: {}
    };
    match = {
        isExact: true,
        params: {},
        path: '',
        url: ''
    };
    mockState = {
        label: '__topicLabel__',
        value: '__topicValue__'
    };
    useStateSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), jest.fn(), jest.fn()]);
});

describe('when the topicSearch component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(getTopicsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the submit button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const submitButton = getByText(wrapper.container, 'Submit');
            fireEvent.click(submitButton);
        });

        expect(history.push).toHaveBeenCalledWith('/topic/__topicValue__');
    });
});

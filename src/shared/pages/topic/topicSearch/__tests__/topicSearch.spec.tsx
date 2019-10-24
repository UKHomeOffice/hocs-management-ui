import React from 'react';
import {createBrowserHistory, History, Location} from 'history';
import { act, wait, fireEvent, getByText, render, RenderResult } from '@testing-library/react';
import TopicSearch from '../topicSearch';
import * as TopicsService from '../../../../services/topicsService';
import { State } from '../state';
import * as useError from '../../../../hooks/useError';
import { match, MemoryRouter } from 'react-router-dom';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

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
const useReducerSpy = jest.spyOn(React, 'useReducer');
const useErrorSpy = jest.spyOn(useError, 'default');

const renderComponent = () => render(
    <MemoryRouter>
        <TopicSearch history={history} location={location} match={match}></TopicSearch>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    mockState = {
        selectedTopic: {
            label: '__topicLabel__',
            value: '__topicValue__'
        }
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), jest.fn(), jest.fn()]);
});

describe('when the topicSearch component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
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

        await wait(async () => {
            const submitButton = getByText(wrapper.container, 'Submit');
            fireEvent.click(submitButton);
        });

        expect(history.push).toHaveBeenCalledWith('/topic/__topicValue__');
    });
});
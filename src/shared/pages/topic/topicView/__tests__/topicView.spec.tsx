import React from 'react';
import { createBrowserHistory, History, Location } from 'history';
import { act, waitFor, fireEvent, getByText, render, RenderResult } from '@testing-library/react';
import * as TeamsService from '../../../../services/teamsService';
import * as TopicsService from '../../../../services/topicsService';
import { State } from '../state';
import * as useError from '../../../../hooks/useError';
import { match, MemoryRouter } from 'react-router-dom';
import TopicView from '../topicView';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

jest.mock('../../../../services/teamsService', () => ({
    __esModule: true,
    getTeams: jest.fn().mockReturnValue(Promise.resolve([{
        label: '__label__',
        value: '__value__'
    }, {
        label: '__label__',
        value: '__value__'
    }]))
}));

jest.mock('../../../../services/topicsService', () => ({
    __esModule: true,
    getTopic: jest.fn().mockReturnValue(Promise.resolve({
        label: '__label__',
        value: '__value__'
    }))
}));

const getTeamsSpy = jest.spyOn(TeamsService, 'getTeams');
const getTopicSpy = jest.spyOn(TopicsService, 'getTopic');

const useReducerSpy = jest.spyOn(React, 'useReducer');
const useErrorSpy = jest.spyOn(useError, 'default');

const renderComponent = () => render(
    <MemoryRouter>
        <TopicView history={history} location={location} match={match}></TopicView>
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
        params: { teamId: '__topicId__' },
        path: '',
        url: ''
    };
    mockState = {
        topic: {
            label: '__label__',
            value: '__value__'
        },
        privateMinisterTeam: {
            label: '__label__',
            value: '__value__'
        },
        draftQATeam: {
            label: '__label__',
            value: '__value__'
        }
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), jest.fn(), jest.fn()]);
});

describe('when the topicView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(3);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(getTeamsSpy).toHaveBeenCalled();
            expect(getTopicSpy).toHaveBeenCalled();
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

        expect(history.push).toHaveBeenCalledWith('/topic/__value__/private-minister/__value__/draft-qa/__value__');
    });
});

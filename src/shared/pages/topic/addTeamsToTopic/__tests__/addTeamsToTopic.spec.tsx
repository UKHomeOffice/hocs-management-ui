import React from 'react';
import { createBrowserHistory, History, Location } from 'history';
import { act, waitFor, render, RenderResult, fireEvent, getByText } from '@testing-library/react';
import * as TeamsService from '../../../../services/teamsService';
import * as TopicsService from '../../../../services/topicsService';
import { State } from '../state';
import * as useError from '../../../../hooks/useError';
import { match, MemoryRouter } from 'react-router-dom';
import AddTeamsToTopicView from '../addTeamsToTopic';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;

jest.mock('../../../../services/teamsService', () => ({
    __esModule: true,
    getTeam: jest.fn().mockReturnValue(Promise.resolve({
        label: '__label__',
        value: '__value__'
    }))
}));

jest.mock('../../../../services/topicsService', () => ({
    __esModule: true,
    getTopic: jest.fn().mockReturnValue(Promise.resolve({
        label: '__label__',
        value: '__value__'
    }))
}));

const getTeamSpy = jest.spyOn(TeamsService, 'getTeam');
const getTopicSpy = jest.spyOn(TopicsService, 'getTopic');
const useReducerSpy = jest.spyOn(React, 'useReducer');
const useErrorSpy = jest.spyOn(useError, 'default');

const renderComponent = () => render(
    <MemoryRouter>
        <AddTeamsToTopicView history={history} location={location} match={match}></AddTeamsToTopicView>
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
        params: { topicId: '__topicId__', privateMinister: '__privateMinister__', draftQA: '__draftQA__' },
        path: '',
        url: ''
    };
    mockState = {
        topic: {
            label: '__label__',
            value: '__value__'
        },
        privateMinisterTeam: {
            active: true,
            displayName: '__displayName__',
            letterName: '__letterName__',
            permissions: [],
            type: '__type__'
        },
        draftQaTeam: {
            active: true,
            displayName: '__displayName__',
            letterName: '__letterName__',
            permissions: [],
            type: '__type__'
        }
    };
    useReducerSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), jest.fn(), jest.fn()]);
});

describe('when the addTeamsToTopicView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(3);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(getTeamSpy).toHaveBeenCalled();
            expect(getTopicSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the submit button is clicked', () => {
    it.skip('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const submitButton = getByText(wrapper.container, 'Submit');
            fireEvent.click(submitButton);
        });

        expect(history.push).toHaveBeenCalledWith('/');
    });
});

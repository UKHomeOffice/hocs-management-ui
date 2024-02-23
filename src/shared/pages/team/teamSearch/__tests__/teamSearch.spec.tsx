import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History } from 'history';
import { act, waitFor, fireEvent, getByText, render, RenderResult } from '@testing-library/react';
import TeamSearch from '../teamSearch';
import * as TeamsService from '../../../../services/teamsService';
import * as useError from '../../../../hooks/useError';
import Item from '../../../../models/item';

let history: History<any>;
let mockState: Item;

jest.mock('../../../../services/teamsService', () => ({
    __esModule: true,
    getTeams: jest.fn().mockReturnValue(Promise.resolve([{
        label: 'Home Office General Property',
        value: '1aa9055d-0572-436b-a69d-4a97588f4ce4'
    }, {
        label: 'Home Office General Property',
        value: '1aa9055d-0572-436b-a69d-4a97588f4ce4'
    }]))
}));

const getTeamsSpy = jest.spyOn(TeamsService, 'getTeams');
const useStateSpy = jest.spyOn(React, 'useState');
const useErrorSpy = jest.spyOn(useError, 'default');

const renderComponent = () => render(
    <MemoryRouter>
        <TeamSearch history={history}></TeamSearch>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    mockState = {
        label: '__teamName__',
        value: '__teamValue__'
    };
    useStateSpy.mockImplementationOnce(() => [mockState, jest.fn()]);
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), jest.fn(), jest.fn()]);
});

describe('when the teamView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(getTeamsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the view team button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const addTeamMembersButton = getByText(wrapper.container, 'View team');
            fireEvent.click(addTeamMembersButton);
        });

        expect(history.push).toHaveBeenCalledWith('/team-view/__teamValue__');
    });
});

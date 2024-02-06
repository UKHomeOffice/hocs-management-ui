import React from 'react';

import * as useError from '../../../../hooks/useError';
import { match, MemoryRouter } from 'react-router';
import ManageNominatedContacts from '../manageNominatedContacts';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { createBrowserHistory, History, Location } from 'history';
import Team from '../../../../models/team';
import { act } from 'react-dom/test-utils';
import * as TeamsService from '../../../../services/teamsService';

const useErrorSpy = jest.spyOn(useError, 'default');

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: Team;

const useStateSpy = jest.spyOn(React, 'useState');
const mockSetState = jest.fn();
const getTeamSpy = jest.spyOn(TeamsService, 'getTeam');
const pageErrorSpy = jest.fn();
const setErrorMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <ManageNominatedContacts history={history} location={location} match={match}></ManageNominatedContacts>
    </MemoryRouter>
);

jest.mock('../nominatedContactList', () => () => 'MOCK_CONTACT_LIST_COMPONENT');
jest.mock('../addNominatedContacts', () => () => 'MOCK_ADD_NOMINATED_CONTACT_COMPONENT');


describe('manage nominated contacts', () => {
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

        mockState = {
            active: true,
            displayName: '__teamName__',
            letterName: '',
            permissions: [],
            type: ''
        };

        useStateSpy.mockImplementation(() => [mockState, mockSetState]);

        useErrorSpy.mockImplementation(() => [{}, jest.fn(), jest.fn(), setErrorMessageSpy]);
        pageErrorSpy.mockReset();
        setErrorMessageSpy.mockReset();
        getTeamSpy.mockReset();

    });

    it('should render with default props', async () => {
        getTeamSpy.mockImplementationOnce(() => Promise.resolve(mockState));

        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should get the team name from the TeamService and set the state', async () => {
        getTeamSpy.mockImplementationOnce(() => Promise.resolve(mockState));

        act(() => {
            renderComponent();
        });
        expect.assertions(2);

        await waitFor(() => {
            expect(getTeamSpy).toBeCalledTimes(1);
            expect(mockSetState).toBeCalledWith(mockState);
        });
    });

    it('should should display an error if the team cannot be retrieved', async () => {
        getTeamSpy.mockImplementationOnce(() => Promise.reject({
            response: {
                status: 500
            }
        }));

        act(() => {
            renderComponent();
        });

        await waitFor(() => {
            expect(getTeamSpy).toBeCalledTimes(1);
            expect(setErrorMessageSpy).toBeCalledWith({
                'description': 'There was an error retrieving the team.  Please try refreshing the page.',
                'title': 'Something went wrong'
            });
        });
    });
});

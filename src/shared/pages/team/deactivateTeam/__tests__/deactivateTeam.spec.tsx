import { act, fireEvent, render, RenderResult, wait, waitForElement } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import DeactivateTeam from '../deactivateTeam';
import { createBrowserHistory, History } from 'history';
import * as TeamsService from '../../../../services/teamsService';
import * as useError from '../../../../hooks/useError';


const mockSetTeamName = jest.fn();
const mockTeamName = '__TeamId__';
const getTeamSpy = jest.spyOn(TeamsService, 'getTeam').mockReturnValue(
    Promise.resolve({ displayName: '__displayName__', active: true, letterName: '', permissions: [], type: '' } )
);
const useStateSpy = jest.spyOn(React, 'useState').mockImplementation(() => [mockTeamName, mockSetTeamName]);
const updateTeamMock = jest.spyOn(TeamsService, 'updateTeam').mockImplementation(() => Promise.resolve(200));
const setErrorMessageSpy = jest.fn();
jest.spyOn(useError, 'default').mockImplementation(() => [{}, jest.fn(), jest.fn(), setErrorMessageSpy]);

let history: History<any>;

const match = {
    isExact: true,
    params: { teamId: '__teamId__' },
    path: '',
    url: ''
};

const location = {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: {}
};

const renderComponent = async () => {
    history = createBrowserHistory();
    history.push = jest.fn();

    act(() => {
        result = render(
            <MemoryRouter>
                <DeactivateTeam history={history} match={match} location={location}/>
            </MemoryRouter>
        );
    });

};

let result: RenderResult;

beforeEach(async () => {
    renderComponent();
});

describe('when the deactivateTeam component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(3);

        expect(getTeamSpy).toHaveBeenCalledWith('__teamId__');
        expect(useStateSpy).toHaveBeenCalled();
        expect(result.container).toMatchSnapshot();
    });
});

describe('when the Deactivate Team button is clicked', () => {
    it('should send a request to deactivate the team and redirect to the team view', async () => {
        const deactivateButton = await waitForElement(async () => {
            return await result.findByText('Deactivate Team');
        });

        fireEvent.click(deactivateButton);

        expect(updateTeamMock).toHaveBeenCalledWith('__teamId__', { active: false });
        await wait(() => {
            expect(history.push).toHaveBeenCalledWith('/team-view/__teamId__', { successMessage: '__TeamId__ has been deactivated successfully' });
        });
    });

    it('should set an error when call to deactivate fails', async () => {
        updateTeamMock.mockImplementationOnce(() => Promise.reject({ response: { status: 500, data: { body: 'update failed' } } } ));

        const deactivateButton = await waitForElement(async () => {
            return await result.findByText('Deactivate Team');
        });

        fireEvent.click(deactivateButton);

        expect(updateTeamMock).toHaveBeenCalledWith('__teamId__', { active: false });
        await wait(() => {
            expect(setErrorMessageSpy).toHaveBeenCalled();
        });
    });
});
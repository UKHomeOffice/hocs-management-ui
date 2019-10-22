import React from 'react';
import { createBrowserHistory, History } from 'history';
import { act, wait, render, RenderResult } from '@testing-library/react';
import UnitSearch from '../unitSearch';
import * as UnitsService from '../../../../services/unitsService';
import { MemoryRouter } from 'react-router-dom';

let history: History<any>;

jest.mock('../../../../services/unitsService', () => ({
    __esModule: true,
    getUnits:jest.fn().mockReturnValue(Promise.resolve(
        [{
            displayName: 'Home Office General Property',
            shortCode: 'shortCode',
            value: '1aa9055d-0572-436b-a69d-4a97588f4ce4'
        }, {
            displayName: 'Home Office General Property',
            shortCode: 'shortCode',
            value: '1aa9055d-0572-436b-a69d-4a97588f4ce4'
        }]
    ))
}));

const getUnitsSpy = jest.spyOn(UnitsService, 'getUnits');
const dispatch = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <UnitSearch history={history}></UnitSearch>
    </MemoryRouter>
);

beforeEach(() => {
    history = createBrowserHistory();
    dispatch.mockReset();
});

describe('when the unitSearch component is mounted', () => {
    it('component should render', async () => {

        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(getUnitsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});
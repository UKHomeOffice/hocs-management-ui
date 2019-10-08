import React from 'react';
import { match } from 'react-router';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, wait, fireEvent, waitForElement } from '@testing-library/react';
import AddUnit from '../addUnit';
import * as UnitsService from '../../../services/unitsService';
import { State } from '../state';
import { ADD_UNIT_ERROR_DESCRIPTION, GENERAL_ERROR_TITLE, DUPLICATE_UNIT_DESCRIPTION, VALIDATION_ERROR_TITLE } from '../../../models/constants';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;
let wrapper: RenderResult;

const useReducerSpy = jest.spyOn(React, 'useReducer');
const dispatch = jest.fn();

jest.spyOn(UnitsService, 'createUnit').mockImplementation(() => Promise.resolve());

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
        errorDescription: '',
        errorTitle: '',
        unit: {
            displayName: '',
            shortCode: '',
            value: ''
        }
    };
    useReducerSpy.mockImplementation(() => [mockState, dispatch]);
    history.push = jest.fn();
    dispatch.mockReset();
    act(() => {
        wrapper = render(<AddUnit history={history} location={location} match={match}></AddUnit>);
    });
});

describe('when the addUnit component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the display name is entered', () => {
    it('should be persisted in the page state', async () => {
        expect.assertions(1);

        const displayNameElement = await waitForElement(async () => {
            return await wrapper.findByLabelText('Display Name');
        });

        fireEvent.blur(displayNameElement, { target: { name: 'displayName', value: '__displayName__' } });

        await wait(() => {
            expect(dispatch).toHaveBeenCalledWith({ payload: { name: 'displayName', value: '__displayName__' }, type: 'SetUnitValues' });
        });
    });
});

describe('when the short code is entered', () => {
    it('should be persisted in the page state', async () => {
        expect.assertions(1);

        const shortCodeElement = await waitForElement(async () => {
            return await wrapper.findByLabelText('Short Code');
        });

        fireEvent.blur(shortCodeElement, { target: { name: 'shortCode', value: '__shortCode__' } });

        await wait(() => {
            expect(dispatch).toHaveBeenCalledWith({ payload: { name: 'shortCode', value: '__shortCode__' }, type: 'SetUnitValues' });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockState.unit = { displayName: '__displayName__', shortCode: '__shortCode__', value: '__value__' };
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {
                expect.assertions(1);

                await wait(() => {
                    expect(history.push).toHaveBeenCalledWith('/');
                });
            });
            it('should call the begin submit action', async () => {
                expect.assertions(1);

                await wait(() => {
                    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'BeginSubmit' });
                });
            });
        });

        describe('and the service call fails', () => {
            beforeAll(() => {
                jest.spyOn(UnitsService, 'createUnit').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));
            });

            it('should set the error state', () => {
                expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'SetGeneralError', payload: { description: ADD_UNIT_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE } });
            });
            it('should call the begin submit action', () => {
                expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'BeginSubmit' });
            });
        });
        describe('and the service call fails with a 409', () => {
            beforeAll(() => {
                jest.spyOn(UnitsService, 'createUnit').mockImplementationOnce(() => Promise.reject({ response: { status: 409 } }));
            });

            it('should set the error state', () => {
                expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'SetGeneralError', payload: { description: DUPLICATE_UNIT_DESCRIPTION, title: VALIDATION_ERROR_TITLE } });
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
            expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'BeginSubmit' });
        });

        it('should set the error state', () => {
            expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'AddValidationError', payload: { key: 'displayName', value: 'Display Name is required' } });
            expect(dispatch).toHaveBeenNthCalledWith(3, { type: 'AddValidationError', payload: { key: 'shortCode', value: 'Short Code is required' } });
        });
    });
});

describe('when the back link is clicked', () => {
    it('will navigate to the homepage', async () => {
        expect.assertions(1);

        const backButton = await waitForElement(async () => {
            return await wrapper.findByText('Back');
        });

        fireEvent.click(backButton);

        await wait(() => {
            expect(history.push).toHaveBeenCalledWith('/');
        });
    });
});

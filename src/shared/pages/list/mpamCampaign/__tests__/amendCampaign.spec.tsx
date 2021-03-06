
import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, wait, fireEvent, waitForElement } from '@testing-library/react';
import { GENERAL_ERROR_TITLE, LOAD_CAMPAIGN_ERROR_DESCRIPTION, AMEND_CAMPAIGN_ERROR_DESCRIPTION } from '../../../../models/constants';
import AmendCampaign from '../amendCampaign';
import * as EntityListService from '../../../../services/entityListService';
import * as useError from '../../../../hooks/useError';
import { State } from '../amendCampaignState';

let match: match<any>;
let history: History<any>;
let location: Location;
let mockState: State;
let wrapper: RenderResult;

const useReducerSpy = jest.spyOn(React, 'useReducer');
const reducerDispatch = jest.fn();
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <AmendCampaign history={history} location={location} match={match}></AmendCampaign>
    </MemoryRouter>
);
const getItemDetailsSpy = jest.spyOn(EntityListService, 'getItemDetails');
const updateListItemSpy = jest.spyOn(EntityListService, 'updateListItem');
beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: { itemUUID: '__itemId__' },
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
        title: '',
        originalTitle: '',
        simpleName: '',
        uuid: ''
    };

    getItemDetailsSpy.mockImplementation(() => Promise.resolve({ simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID' }));
    updateListItemSpy.mockImplementation(() => Promise.resolve());
    useReducerSpy.mockImplementation(() => [mockState, reducerDispatch]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorSpy, clearErrorsSpy, setMessageSpy]);
    history.push = jest.fn();
    reducerDispatch.mockReset();
    addFormErrorSpy.mockReset();
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the amendCampaign component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        wrapper = renderComponent();
        await wait(() => {
            expect(getItemDetailsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should initially render blank before item title is returned', async () => {
        getItemDetailsSpy.mockReturnValueOnce(Promise.resolve(
            { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID' }
        ));
        mockState.originalTitle = '';
        const wrapper: RenderResult = renderComponent();
        expect(wrapper.container.outerHTML).toMatchSnapshot();
    });

    it('should display an error if the call to retrieve item details fails', async () => {
        expect.assertions(1);
        getItemDetailsSpy.mockImplementation(() => Promise.reject('error'));

        wrapper = renderComponent();

        await wait(() => {
            expect(setMessageSpy).toBeCalledWith({ title: GENERAL_ERROR_TITLE, description: LOAD_CAMPAIGN_ERROR_DESCRIPTION });
        });

    });
});

describe('when the new name is entered', () => {
    it('should be persisted in the page state', async () => {
        wrapper = renderComponent();
        getItemDetailsSpy.mockReturnValueOnce(Promise.resolve(
            { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID' }
        ));
        const nameElement = await waitForElement(async () => {
            return await wrapper.findByLabelText('New campaign name');
        });

        fireEvent.change(nameElement, { target: { name: 'title', value: 'newTestCampaignTitle' } });

        await wait(() => {

            expect(reducerDispatch).toHaveBeenCalledWith({ type: 'SetTitle', payload: 'newTestCampaignTitle' });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockState.title = '__displayName__';
            mockState.simpleName = '__shortCode__';
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {

                getItemDetailsSpy.mockReturnValueOnce(Promise.resolve(
                    { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID' }
                ));
                await wait(() => {
                    expect(getItemDetailsSpy).toHaveBeenCalled();
                    expect(updateListItemSpy).toHaveBeenCalled();
                    expect(history.push).toHaveBeenCalledWith('/', { successMessage: 'The campaign was amended successfully' });
                });
            });
            it('should call the begin submit action', async () => {

                await wait(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });
    });
    describe('and the data is not filled in', () => {
        beforeEach(async () => {
            updateListItemSpy.mockReturnValueOnce(Promise.resolve(
                { simpleName: 'testSimpleName', title: 'testTitle', uuid: 'testUUID' }
            ));
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorSpy).toHaveBeenNthCalledWith(1, { key: 'title', value: 'The New campaign name is required' });
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {

        beforeEach(async () => {
            updateListItemSpy.mockReset();
            updateListItemSpy.mockImplementation(() => Promise.reject({ response: { status: 500 } }));
            mockState.title = '__displayName__';
            mockState.simpleName = '__shortCode__';
            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call fails', () => {
            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: AMEND_CAMPAIGN_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE });
            });

            it('should call the begin submit action', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
    });
});

import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, wait, fireEvent, waitForElement } from '@testing-library/react';
import * as TopicsService from '../../../../services/topicsService';
import { GENERAL_ERROR_TITLE, VALIDATION_ERROR_TITLE, DUPLICATE_PARENT_TOPIC_DESCRIPTION, ADD_PARENT_TOPIC_ERROR_DESCRIPTION } from '../../../../models/constants';
import * as useError from '../../../../hooks/useError';
import AddParentTopic from '../addParentTopic';
import ErrorMessage from '../../../../models/errorMessage';

let match: match<any>;
let history: History<any>;
let location: Location;
let wrapper: RenderResult;

const useStateSpy = jest.spyOn(React, 'useState');
const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();
const setDisplayNameSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <AddParentTopic history={history} location={location} match={match}></AddParentTopic>
    </MemoryRouter>
);

jest.mock('../../../../services/topicsService', () => ({
    __esModule: true,
    addParentTopic: () => Promise.resolve()
}));

beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: {},
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

    useStateSpy.mockImplementation(() => ['displayName', setDisplayNameSpy]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorSpy, clearErrorsSpy, setMessageSpy]);
    history.push = jest.fn();
    addFormErrorSpy.mockReset();
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the addParentTopic component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await wait(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the topic name is entered', () => {
    it('should be persisted in the page state', async () => {
        expect.assertions(1);

        const displayNameElement = await waitForElement(async () => {
            return await wrapper.findByLabelText('Topic Name');
        });

        fireEvent.change(displayNameElement, { target: { name: 'displayName', value: 'Topic' } });

        await wait(() => {
            expect(setDisplayNameSpy).toHaveBeenCalledWith('Topic');
        });
    });
});

describe('when the submit button is clicked', () => {
    describe('and the data is filled in', () => {
        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {
                expect.assertions(1);

                jest.spyOn(TopicsService, 'addParentTopic').mockImplementationOnce(() => Promise.resolve({ response: { status: 200 } }));

                const submitButton = await waitForElement(async () => {
                    return await wrapper.findByText('Submit');
                });
                fireEvent.click(submitButton);

                await wait(() => {
                    expect(history.push).toHaveBeenCalledWith('/', { successMessage: 'The parent topic was created successfully' });
                });
            });
            it('should call the onSubmit action', async () => {
                expect.assertions(1);

                jest.spyOn(TopicsService, 'addParentTopic').mockImplementationOnce(() => Promise.resolve({ response: { status: 200 } }));

                const submitButton = await waitForElement(async () => {
                    return await wrapper.findByText('Submit');
                });
                fireEvent.click(submitButton);

                await wait(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });

        describe('and the service call fails', () => {
            it('should set the error state', async () => {
                expect.assertions(1);

                jest.spyOn(TopicsService, 'addParentTopic').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));

                const submitButton = await waitForElement(async () => {
                    return await wrapper.findByText('Submit');
                });
                fireEvent.click(submitButton);

                await wait(() => {
                    expect(setMessageSpy).toHaveBeenCalledWith({ description: ADD_PARENT_TOPIC_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE });
                });
            });
            it('should call the begin submit action', async () => {
                expect.assertions(1);

                jest.spyOn(TopicsService, 'addParentTopic').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));

                const submitButton = await waitForElement(async () => {
                    return await wrapper.findByText('Submit');
                });
                fireEvent.click(submitButton);

                await wait(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });

        describe('and the service call fails with a 400', () => {
            it('should set the error state', async () => {
                expect.assertions(1);

                jest.spyOn(TopicsService, 'addParentTopic').mockImplementationOnce(() => Promise.reject({ response: { status: 400 } }));

                const submitButton = await waitForElement(async () => {
                    return await wrapper.findByText('Submit');
                });
                fireEvent.click(submitButton);

                await wait(() => {
                    expect(setMessageSpy).toHaveBeenCalledWith(new ErrorMessage(DUPLICATE_PARENT_TOPIC_DESCRIPTION, VALIDATION_ERROR_TITLE));
                });
            });
        });
    });

    describe('and the data is not filled in', () => {
        beforeEach(async () => {
            useStateSpy.mockImplementationOnce(() => [undefined, setDisplayNameSpy]);

            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect.assertions(1);

            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', async () => {
            expect.assertions(1);

            await wait(() => {
                expect(addFormErrorSpy).toHaveBeenCalledWith({ key: '', value: 'The Parent Topic is required' });
            });
        });
    });

    describe('with invalid characters', () => {
        beforeEach(async () => {
            useStateSpy.mockImplementationOnce(() => ['Invalid@Topic', setDisplayNameSpy]);

            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect.assertions(1);

            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', async () => {
            expect.assertions(1);

            await wait(() => {
                expect(addFormErrorSpy).toHaveBeenCalledWith({ key: '', value: 'The Parent Topic contains invalid characters' });
            });
        });
    });

    describe('with valid characters', () => {
        beforeEach(async () => {
            useStateSpy.mockImplementationOnce(() => ['Invalid-Topic', setDisplayNameSpy]);

            const submitButton = await waitForElement(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect.assertions(1);

            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', async () => {
            expect.assertions(1);

            await wait(() => {
                expect(addFormErrorSpy).toBeCalledTimes(0);
            });
        });
    });
});

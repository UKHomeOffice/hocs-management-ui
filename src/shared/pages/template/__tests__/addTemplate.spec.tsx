import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, render, RenderResult, fireEvent, waitFor } from '@testing-library/react';
import AddTemplate from '../addTemplate';
import * as TemplatesService from '../../../services/templatesService';
import { GENERAL_ERROR_TITLE, ADD_TEMPLATE_ERROR_DESCRIPTION, LOAD_CASE_TYPE_ERROR_DESCRIPTION } from '../../../models/constants';
import Template from '../../../models/template';
import * as useError from '../../../hooks/useError';
import * as CaseTypesService from '../../../services/caseTypesService';
import { createMockFile } from '../../../../../test/createMockFile';

jest.mock('../../../services/caseTypesService', () => ({
    __esModule: true,
    getCaseType: jest.fn().mockReturnValue(Promise.resolve({
        displayName: '__displayName__',
        label: '__label__',
        shortCode: '__shortCode__',
        type: '__type__',
        value: '__caseType1__'
    }))
}));

const useStateSpy = jest.spyOn(React, 'useState');
const mockSetState = jest.fn();
const getCaseTypeSpy = jest.spyOn(CaseTypesService, 'getCaseType');

let match: match<any>;
let history: History<any>;
let location: Location;
let mockTemplate: Template;
let wrapper: RenderResult;

const useErrorSpy = jest.spyOn(useError, 'default');
const addFormErrorSpy = jest.fn();
const clearErrorsSpy = jest.fn();
const setMessageSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <AddTemplate history={history} location={location} match={match}></AddTemplate>
    </MemoryRouter>
);

jest.spyOn(TemplatesService, 'addTemplate').mockImplementation(() => Promise.resolve());

beforeEach(() => {
    history = createBrowserHistory();
    match = {
        isExact: true,
        params: { type: '__type__' },
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
    mockTemplate = {
        caseType: undefined,
        files: undefined
    };
    mockTemplate = {
        files: undefined
    };
    useStateSpy.mockImplementation(() => [mockTemplate, mockSetState]);
    useErrorSpy.mockImplementation(() => [{}, addFormErrorSpy, clearErrorsSpy, setMessageSpy]);
    history.push = jest.fn();
    addFormErrorSpy.mockReset();
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
    act(() => {
        wrapper = renderComponent();
    });
});

describe('when the addTemplate component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });

    it('should display an error if the call to retrieve the case type fail', async () => {
        expect.assertions(2);

        getCaseTypeSpy.mockImplementation(() => Promise.reject('error'));

        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(setMessageSpy).toBeCalledWith({ title: GENERAL_ERROR_TITLE, description: LOAD_CASE_TYPE_ERROR_DESCRIPTION });
        });

    });
});

describe('when the submit button is clicked', () => {
    beforeAll(() => {
        getCaseTypeSpy.mockReturnValue(Promise.resolve({
            displayName: '__displayName__',
            label: '__label__',
            shortCode: '__shortCode__',
            type: '__type__',
            value: '__caseType1__'
        }));
    });

    describe('and the data is filled in', () => {

        beforeEach(async () => {
            mockTemplate.files = [createMockFile('mock.docx', 1024, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')];
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        describe('and the service call is successful', () => {
            it('should redirect to the home page', async () => {
                expect.assertions(1);

                await waitFor(() => {
                    expect(history.push).toHaveBeenCalledWith('/case-type/__type__', { successMessage: 'The template was created successfully' });
                });
            });
            it('should clear any previous errors', async () => {
                expect.assertions(1);

                await waitFor(() => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });

        describe('and the service call fails', () => {
            beforeAll(() => {
                jest.spyOn(TemplatesService, 'addTemplate').mockImplementationOnce(() => Promise.reject({ response: { status: 500 } }));
            });

            it('should set the error state', () => {
                expect(setMessageSpy).toHaveBeenCalledWith({ description: ADD_TEMPLATE_ERROR_DESCRIPTION, title: GENERAL_ERROR_TITLE });
            });

            it('should clear any previous errors', () => {
                expect(clearErrorsSpy).toHaveBeenCalled();
            });
        });
    });

    describe('and the data is not filled in', () => {
        beforeEach(async () => {
            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorSpy).toHaveBeenCalledWith({ key: 'files', value: 'The Template is required' });
        });
    });

    describe('and the data is wrongly filled in', () => {
        beforeEach(async () => {
            mockTemplate.files = [createMockFile('mock.txt', 1024, 'text/plain')];

            const submitButton = await waitFor(async () => {
                return await wrapper.findByText('Submit');
            });

            fireEvent.click(submitButton);
        });

        it('should call the begin submit action', () => {
            expect(clearErrorsSpy).toHaveBeenCalled();
        });

        it('should set the error state', () => {
            expect(addFormErrorSpy).toHaveBeenCalledWith({ key: 'files', value: 'Only docx templates supported' });
        });
    });
});

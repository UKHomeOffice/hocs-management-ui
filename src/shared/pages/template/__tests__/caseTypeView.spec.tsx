import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, waitFor, fireEvent, getByText, render, RenderResult } from '@testing-library/react';
import CaseTypeView from '../caseTypeView';
import * as CaseTypesService from '../../../services/caseTypesService';
import * as TemplatesService from '../../../services/templatesService';
import * as useError from '../../../hooks/useError';
import * as constants from '../../../models/constants';

let match: match<any>;
let history: History<any>;
let location: Location;

jest.mock('../../../services/caseTypesService', () => ({
    __esModule: true,
    getCaseType: jest.fn().mockReturnValue(Promise.resolve({
        displayName: '__displayName__',
        label: '__label__',
        shortCode: '__shortCode__',
        type: '__type__',
        value: '__caseType1__'
    })),
    getTemplatesForCaseType: jest.fn().mockReturnValue(Promise.resolve([{
        label: '__template1__',
        value: '__templateId1__'
    }, {
        label: '__template2__',
        value: '__templateId2__'
    }]))
}));

jest.mock('../../../services/templatesService', () => ({
    __esModule: true,
    deleteTemplate: jest.fn().mockReturnValue(Promise.resolve())
}));

const getCaseTypeSpy = jest.spyOn(CaseTypesService, 'getCaseType');
const getTemplatesForCaseTypeSpy = jest.spyOn(CaseTypesService, 'getTemplatesForCaseType');
const deleteTemplateSpy = jest.spyOn(TemplatesService, 'deleteTemplate');
const useErrorSpy = jest.spyOn(useError, 'default');
const setMessageSpy = jest.fn();
const clearErrorsSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <CaseTypeView history={history} location={location} match={match}></CaseTypeView>
    </MemoryRouter>
);

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
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the CaseTypeView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(7);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(() => {
            expect(getCaseTypeSpy).toHaveBeenCalled();
            expect(getTemplatesForCaseTypeSpy).toHaveBeenCalled();
            expect(wrapper.container.getElementsByClassName('govuk-table__row').length).toBe(3);
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the Add template button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const addTemplateButton = getByText(wrapper.container, 'Add template');
            fireEvent.click(addTemplateButton);
        });

        expect(history.push).toHaveBeenCalledWith('/case-type/__type__/add-template');
    });
});

describe('when the remove template button is clicked', () => {
    it('should remove the row from the templates table', async () => {
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await waitFor(async () => {
            const selectedTemplate = getByText(wrapper.container, '__template1__');
            const row = (selectedTemplate.closest('tr'));
            const removeButton = getByText(row as HTMLElement, 'Remove');
            fireEvent.click(removeButton);
        });

        expect(deleteTemplateSpy).nthCalledWith(1, '__templateId1__');
        expect(getTemplatesForCaseTypeSpy).nthCalledWith(1, '__type__');

    });

    describe('and the service call fails', () => {
        beforeEach(() => {
            let wrapper: RenderResult;
            act(() => {
                wrapper = renderComponent();
            });

            waitFor(async () => {
                const selectedTemplate = getByText(wrapper.container, '__template1__');
                const row = (selectedTemplate.closest('tr'));
                const removeButton = getByText(row as HTMLElement, 'Remove');
                fireEvent.click(removeButton);
            });
        });

        describe('and its a 500 error', () => {
            beforeAll(() => {
                jest.spyOn(TemplatesService, 'deleteTemplate').mockImplementation(() => Promise.reject({ response: { status: 500 } }));
            });
            it('should set the error state', () => {
                waitFor(async () => {
                    expect(setMessageSpy).toHaveBeenCalledWith({ description: constants.REMOVE_TEMPLATE_ERROR_DESCRIPTION, title: constants.GENERAL_ERROR_TITLE });
                });
            });
            it('should call the clear errors method', () => {
                waitFor(async () => {
                    expect(clearErrorsSpy).toHaveBeenCalled();
                });
            });
        });
    });
});

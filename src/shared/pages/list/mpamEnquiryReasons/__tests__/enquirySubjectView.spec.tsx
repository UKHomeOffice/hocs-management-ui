import React from 'react';
import { match, MemoryRouter } from 'react-router-dom';
import { createBrowserHistory, History, Location } from 'history';
import { act, wait, render, RenderResult, getByText, fireEvent } from '@testing-library/react';
import * as ListService from '../../../../services/entityListService';
import * as useError from '../../../../hooks/useError';
import EnquirySubjectView from '../enquirySubjectView';

let match: match<any>;
let history: History<any>;
let location: Location;

jest.mock('../../../../services/entityListService', () => ({
    __esModule: true,
    getListItems: jest.fn().mockReturnValue(Promise.resolve({
        data: [{
            simpleName: 'testSimpleName1',
            uuid: 'testId1',
            title: 'testTitle1'
        }, {
            simpleName: 'testSimpleName2',
            uuid: 'testId2',
            title: 'testTitle2'
        }]
    }))
}));

const getListItemsSpy = jest.spyOn(ListService, 'getListItems');
const useErrorSpy = jest.spyOn(useError, 'default');
const setMessageSpy = jest.fn();
const clearErrorsSpy = jest.fn();

const renderComponent = () => render(
    <MemoryRouter>
        <EnquirySubjectView history={history} location={location} match={match}></EnquirySubjectView>
    </MemoryRouter>
);

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
    useErrorSpy.mockImplementation(() => [{}, jest.fn(), clearErrorsSpy, setMessageSpy]);
    clearErrorsSpy.mockReset();
    setMessageSpy.mockReset();
});

describe('when the enquirySubjectView component is mounted', () => {
    it('should render with default props', async () => {
        expect.assertions(2);
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(() => {
            expect(getListItemsSpy).toHaveBeenCalled();
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the Add Enquiry Reason button is clicked', () => {
    it('should push a new page into the history', async () => {
        history.push = jest.fn();
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });

        await wait(async () => {
            const addEnquiryReasonButton = getByText(wrapper.container, 'Add Enquiry Reason');

            fireEvent.click(addEnquiryReasonButton);
        });

        expect(history.push).toHaveBeenCalledWith('/add-enquiry-reason/undefined');
    });
});

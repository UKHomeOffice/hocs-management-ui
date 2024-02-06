import React from 'react';
import { act, fireEvent, getByText, render, RenderResult, waitFor, getByLabelText } from '@testing-library/react';
import AddNominatedContact from '../addNominatedContacts';
import * as NominatedContactsService from '../../../../services/nominatedContactsService';

const mockAddFormError = jest.fn();
const mockClearErrors = jest.fn();
const mockSetErrorMessage = jest.fn();
const mockDispatch = jest.fn();

jest.spyOn(React, 'useContext').mockImplementation(() => ({
    dispatch: mockDispatch
}));

const renderComponent = () => render(
    <AddNominatedContact teamId="testTeam" errorFuncs={[null, mockAddFormError, mockClearErrors, mockSetErrorMessage]}/>
);

const addNominatedContactSpy = jest.spyOn(NominatedContactsService, 'addNominatedContact');

describe('when the AddNominatedContact component is mounted', () => {
    it('should render with default props', async () => {
        let wrapper: RenderResult;
        act(() => {
            wrapper = renderComponent();
        });
        expect.assertions(1);

        await waitFor(() => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});

describe('when the submit button is clicked', () => {
    let wrapper: RenderResult;

    beforeEach(() => {
        mockAddFormError.mockReset();
        mockClearErrors.mockReset();
        mockSetErrorMessage.mockReset();
        mockDispatch.mockReset();
        addNominatedContactSpy.mockReset();

        act(() => {
            wrapper = renderComponent();
        });
    });

    const updateEmailAddressInputText = async (email: string) => {
        act(() => {
            const emailAddressInput = getByLabelText(wrapper.container, 'Email Address');
            fireEvent.change(emailAddressInput, { target: { value: email } });
        });
    };

    const fireSubmit = async () => {
        act(() => {
            const submitButton = getByText(wrapper.container, 'Add nominated contact');
            fireEvent.click(submitButton);
        });
    };


    it('should show errors and not attempt to submit address which fail validation', async () => {
        updateEmailAddressInputText('');
        fireSubmit();

        await waitFor(async () => {
            expect(mockClearErrors).toBeCalledTimes(1);
            expect(addNominatedContactSpy).toBeCalledTimes(0);
            expect(mockDispatch).toBeCalledTimes(0);

            expect(mockAddFormError).nthCalledWith(1, {
                'key': 'inputValue',
                'value': 'The email address is required',
            });

            expect(mockAddFormError).nthCalledWith(2, {
                'key': 'inputValue',
                'value': 'The email address contains invalid characters'
            });
        });
    });

    it('should show the correct error for duplicate email', async () => {

        addNominatedContactSpy.mockImplementationOnce(() => Promise.reject({
            response: {
                status: 409
            }
        }));

        updateEmailAddressInputText('a@a.example.org');
        fireSubmit();

        await waitFor(async () => {
            expect(mockClearErrors).toBeCalledTimes(1);
            expect(addNominatedContactSpy).toBeCalledTimes(1);
            expect(mockDispatch).toBeCalledTimes(0);

            expect(mockSetErrorMessage).toBeCalledWith({
                'description': 'A nominated contact with those email details already exists',
                'title': 'There was a error validating the response'
            });
        });
    });

    it('should show a generic error for errors other than duplicate email', async () => {
        addNominatedContactSpy.mockImplementationOnce(() => Promise.reject({
            response: {
                status: 400
            }
        }));

        updateEmailAddressInputText('a@a.example.org');
        fireSubmit();

        await waitFor(async () => {
            expect(mockClearErrors).toBeCalledTimes(1);
            expect(addNominatedContactSpy).toBeCalledTimes(1);
            expect(mockDispatch).toBeCalledTimes(0);

            expect(mockSetErrorMessage).toBeCalledWith({
                'description': 'Something went wrong while adding the nominated contact. Please try again.',
                'title': 'Something went wrong'
            });
        });
    });

    it('should call the service and update the context on success', async () => {

        addNominatedContactSpy.mockImplementationOnce(() => Promise.resolve({ uuid: 'new-uuid' }));

        updateEmailAddressInputText('abc@example.org');
        fireSubmit();

        await waitFor(async () => {
            expect(mockClearErrors).toBeCalledTimes(1);

            expect(addNominatedContactSpy).toBeCalledWith({
                emailAddress: 'abc@example.org',
                teamUUID: 'testTeam'
            });

            expect(mockDispatch).toBeCalledWith({
                'payload': {
                    'label': 'abc@example.org',
                    'value': 'new-uuid',
                },
                'type': 'AddContact'
            });
        });
    });
});

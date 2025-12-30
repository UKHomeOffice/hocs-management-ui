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
        await act(async () => {
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

    beforeEach(async () => {
        mockAddFormError.mockReset();
        mockClearErrors.mockReset();
        mockSetErrorMessage.mockReset();
        mockDispatch.mockReset();
        addNominatedContactSpy.mockReset();

        await act(async () => {
            wrapper = renderComponent();
        });
    });

    const updateEmailAddressInputText = async (email: string) => {
        await act(async () => {
            const emailAddressInput = getByLabelText(wrapper.container, 'Email Address');
            fireEvent.change(emailAddressInput, { target: { value: email } });
        });
    };

    const fireSubmit = async () => {
        await act(async () => {
            const submitButton = getByText(wrapper.container, 'Add nominated contact');
            fireEvent.click(submitButton);
        });
    };


    it('should show errors and not attempt to submit address which fail validation', async () => {
        await updateEmailAddressInputText('');
        await fireSubmit();

        await waitFor(async () => {
            expect(mockClearErrors).toHaveBeenCalledTimes(1);
            expect(addNominatedContactSpy).toHaveBeenCalledTimes(0);
            expect(mockDispatch).toHaveBeenCalledTimes(0);

            expect(mockAddFormError).toHaveBeenNthCalledWith(1, {
                'key': 'inputValue',
                'value': 'The email address is required',
            });

            expect(mockAddFormError).toHaveBeenNthCalledWith(2, {
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

        await updateEmailAddressInputText('a@a.example.org');
        await fireSubmit();

        await waitFor(async () => {
            expect(mockClearErrors).toHaveBeenCalledTimes(1);
            expect(addNominatedContactSpy).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledTimes(0);

            expect(mockSetErrorMessage).toHaveBeenCalledWith({
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

        await updateEmailAddressInputText('a@a.example.org');
        await fireSubmit();

        await waitFor(async () => {
            expect(mockClearErrors).toHaveBeenCalledTimes(1);
            expect(addNominatedContactSpy).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledTimes(0);

            expect(mockSetErrorMessage).toHaveBeenCalledWith({
                'description': 'Something went wrong while adding the nominated contact. Please try again.',
                'title': 'Something went wrong'
            });
        });
    });

    it('should call the service and update the context on success', async () => {

        addNominatedContactSpy.mockImplementationOnce(() => Promise.resolve({ uuid: 'new-uuid' }));

        await updateEmailAddressInputText('abc@example.org');
        await fireSubmit();

        await waitFor(async () => {
            expect(mockClearErrors).toHaveBeenCalledTimes(1);

            expect(addNominatedContactSpy).toHaveBeenCalledWith({
                emailAddress: 'abc@example.org',
                teamUUID: 'testTeam'
            });

            expect(mockDispatch).toHaveBeenCalledWith({
                'payload': {
                    'label': 'abc@example.org',
                    'value': 'new-uuid',
                },
                'type': 'AddContact'
            });
        });
    });
});

import { act, fireEvent, getByText, render, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import NominatedContactList from '../nominatedContactList';
import Contact from '../../../../models/contact';
import Item from '../../../../models/item';
import * as NominatedContactsService from '../../../../services/nominatedContactsService';

const mockContacts: Array<Contact> = [
    { id: 0, uuid: 'uuid1', teamUUID: 'teamUUID1', emailAddress: 'one@example.org' },
    { id: 1, uuid: 'uuid2', teamUUID: 'teamUUID2', emailAddress: 'two@example.org' },
    { id: 2, uuid: 'uuid3', teamUUID: 'teamUUID3', emailAddress: 'three@example.org' }
];

const mockContactShortList: Array<Contact> = [
    { id: 0, uuid: 'uuid1', teamUUID: 'teamUUID1', emailAddress: 'one@example.org' }
];

const mockContactItems: Array<Item> = [
    { value: 'uuid1', label: 'one@example.org' },
    { value: 'uuid2', label: 'two@example.org' },
    { value: 'uuid3', label: 'three@example.org' }
];

const mockContactItemsShortList: Array<Item> = [
    { value: 'uuid1', label: 'one@example.org' }
];

const getNominatedContactsForTeamSpy =
    jest.spyOn(NominatedContactsService, 'getNominatedContactsForTeam');

const removeNominatedContactsForTeamSpy =
    jest.spyOn(NominatedContactsService, 'removeNominatedContactFromTeam');

const mockClearErrors = jest.fn();
const mockSetErrorMessage = jest.fn();
const mockDispatch = jest.fn();

const renderComponent = () => render(
    <NominatedContactList teamId="testTeam" errorFuncs={[null, null, mockClearErrors, mockSetErrorMessage]}/>
);

describe('NominatedContactList', () => {
    beforeEach(() => {
        jest.spyOn(React, 'useContext').mockImplementation(() => ({
            dispatch: mockDispatch,
            state: {
                contacts: mockContactItems
            }
        }));

        mockClearErrors.mockReset();
        mockSetErrorMessage.mockReset();
        mockDispatch.mockReset();
    });

    describe('when the NominatedContactList component is mounted', () => {
        it('should render with default props and populate state', async () => {
            getNominatedContactsForTeamSpy.mockImplementationOnce(() => Promise.resolve(mockContacts));

            let wrapper: RenderResult;
            await act(async () => {
                wrapper = renderComponent();
            });
            expect.assertions(2);

            await waitFor(() => {
                expect(mockDispatch).toHaveBeenCalledWith({ 'type': 'SetContacts', payload: mockContactItems });
                expect(wrapper.container).toMatchSnapshot();
            });
        });

        it('should set an error if get nominated contacts failed', async () => {
            getNominatedContactsForTeamSpy.mockImplementationOnce(() => Promise.reject({
                response: {
                    status: 500
                }
            }));

            let wrapper: RenderResult;
            await act(async () => {
                wrapper = renderComponent();
            });
            expect.assertions(3);

            await waitFor(() => {
                expect(mockDispatch).toHaveBeenCalledTimes(0);
                expect(mockSetErrorMessage).toHaveBeenCalledWith({
                    'description': 'There was an error retrieving the list of nominated contacts.  Please try refreshing the page.',
                    'title': 'Something went wrong'
                });

                expect(wrapper.container).toMatchSnapshot();
            });
        });
    });

    describe('remove contact', () => {
        let wrapper: RenderResult;
        beforeEach(async () => {
            getNominatedContactsForTeamSpy.mockImplementationOnce(() => Promise.resolve(mockContacts));
            jest.spyOn(React, 'useContext').mockImplementation(() => ({
                dispatch: mockDispatch,
                state: {
                    contacts: mockContactItems
                }
            }));

            await act(async () => {
                wrapper = renderComponent();
            });
        });

        it('should remove a contact when remove is clicked', async () => {
            removeNominatedContactsForTeamSpy.mockImplementationOnce(() => Promise.resolve());

            await act(async () => {
                const selectedContact = getByText(wrapper.container, 'two@example.org');
                const row = (selectedContact.closest('tr'));
                const removeButton = getByText(row as HTMLElement, 'Remove');
                fireEvent.click(removeButton);
            });

            await waitFor(() => {
                expect(mockDispatch).toHaveBeenCalledTimes(2);
                expect(mockDispatch).toHaveBeenCalledWith({
                    'type': 'RemoveContact',
                    'payload': { 'value': 'uuid2', 'label': 'two@example.org' }
                });
            });
        });

        it('should set an error if the item cannot be removed', async () => {
            removeNominatedContactsForTeamSpy.mockImplementationOnce(() => Promise.reject({
                response: {
                    status: 500
                }
            }));

            await act(async () => {
                const selectedContact = getByText(wrapper.container, 'two@example.org');
                const row = (selectedContact.closest('tr'));
                const removeButton = getByText(row as HTMLElement, 'Remove');
                fireEvent.click(removeButton);
            });

            await waitFor(() => {
                expect(mockDispatch).toHaveBeenCalledTimes(1);
                expect(mockSetErrorMessage).toHaveBeenCalledWith({
                    'description': 'There was an error deleting the nominated contact. Please try refreshing the page.',
                    'title': 'Something went wrong',
                });
            });
        });
    });

    describe('Remove contact messaging', () => {
        let wrapper: RenderResult;
        beforeEach(async () => {
            getNominatedContactsForTeamSpy.mockImplementationOnce(() => Promise.resolve(mockContacts));
            jest.spyOn(React, 'useContext').mockImplementation(() => ({
                dispatch: mockDispatch,
                state: {
                    contacts: mockContactItemsShortList
                }
            }));

            await act(async () => {
                wrapper = renderComponent();
            });
        });

        it('should set an error if there is only one contact', async () => {
            getNominatedContactsForTeamSpy.mockImplementationOnce(() => Promise.resolve(mockContactShortList));

            await act(async () => {
                const selectedContact = getByText(wrapper.container, 'one@example.org');
                const row = (selectedContact.closest('tr'));
                const removeButton = getByText(row as HTMLElement, 'Remove');
                fireEvent.click(removeButton);
            });

            await waitFor(() => {
                expect(mockDispatch).toHaveBeenCalledTimes(1);
                expect(mockSetErrorMessage).toHaveBeenCalledWith({
                    'description': 'Unable to delete nominated contact - teams must have at least one contact.',
                    'title': 'Something went wrong',
                });
            });
        });
    });
});

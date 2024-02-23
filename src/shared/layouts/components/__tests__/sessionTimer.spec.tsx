import React from 'react';
import { render } from '@testing-library/react';
import SessionTimer from '../sessionTimer';
import { ApplicationProvider } from '../../../contexts/application';
import { HelmetProvider } from 'react-helmet-async';
import Modal from 'react-modal';

jest
    .spyOn(Modal, 'setAppElement')
    .mockImplementation(param => console.log(param));
describe('<Component />', () => {});
jest.useFakeTimers();

const config = {
    analytics: undefined,
    csrf: '',
    layout: {
        body: { phaseBanner: { feedback: '', isVisible: true, phase: '' } },
        countDownForSeconds: 5,
        defaultTimeoutSeconds: 10,
        footer: { isVisible: true, links: [] },
        header: {
            isVisible: true,
            service: 'service name',
            serviceLink: '',
        },
    },
    user: {
        roles: []
    }
};

describe('Session timer component', () => {

    it('should render with default props', () => {

        expect(
            render(
                <HelmetProvider>
                    <ApplicationProvider config={config}>
                        <SessionTimer />
                    </ApplicationProvider>
                </HelmetProvider>
            )
        ).toMatchSnapshot();
    });
});

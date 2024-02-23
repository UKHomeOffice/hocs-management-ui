import React from 'react';
import Layout from '../layout.tsx';
import { render, screen } from '@testing-library/react';
import { ApplicationProvider } from '../../contexts/application';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';

jest.mock('react-router-dom', () => {
    return {
        Link: () => jest.fn()
    };
});

describe('Page layout component', () => {

    const mockDispatch = jest.fn();
    const mockLayout = {
        header: {},
        body: {},
        footer: {}
    };

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render the footer when provided', () => {
        const mockLayoutWithFooter = { ...mockLayout, footer: { isVisible: true } };
        const defaultProps = {
            layout: mockLayoutWithFooter,
            csrf: '1234567890',
            user: {
                roles: ['1234', '54321']
            }
        };

        const config = {
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
        const wrapper = render(
            <HelmetProvider>
                <ApplicationProvider config={{ ...config }}>
                    <Layout />
                </ApplicationProvider>
            </HelmetProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('© Crown copyright')).toBeInTheDocument();
    });

});

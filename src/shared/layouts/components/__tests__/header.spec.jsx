import React from 'react';
import Header from '../header.tsx';
import { render } from '@testing-library/react';
import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

describe('Layout header component', () => {
    it('should render with default props', () => {
        expect(
            render(
                <HelmetProvider>
                    <ApplicationProvider>
                        <MemoryRouter>
                            <Header />
                        </MemoryRouter>
                    </ApplicationProvider>
                </HelmetProvider>)
        ).toMatchSnapshot();
    });

    it('should render without crest when service is not GOV.UK', () => {
        expect(
            render(
                <HelmetProvider>
                    <ApplicationProvider>
                        <MemoryRouter>
                            <Header service="Test Service" />
                        </MemoryRouter>
                    </ApplicationProvider>
                </HelmetProvider>
            )
        ).toMatchSnapshot();
    });
});

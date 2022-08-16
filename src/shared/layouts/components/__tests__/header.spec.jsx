import React from 'react';
import Header from '../header.tsx';
import { render } from '@testing-library/react';
import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';

describe('Layout header component', () => {
    it('should render with default props', () => {
        expect(
            render(
                <ApplicationProvider>
                    <MemoryRouter>
                        <Header />
                    </MemoryRouter>
                </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render without crest when service is not GOV.UK', () => {
        expect(
            render(
                <ApplicationProvider>
                    <MemoryRouter>
                        <Header service="Test Service" />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });
});

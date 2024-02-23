import React from 'react';
import Page from '../page-enabled.tsx';
import { render } from '@testing-library/react';
import { ApplicationProvider } from '../../contexts/application';
import { HelmetProvider } from 'react-helmet-async';

jest.mock('../error.tsx', () => () => 'MOCK_ERROR_PAGE');
jest.mock('../../contexts/actions/index.ts', () => ({
    unsetError: jest.fn(),
    clearApiStatus: jest.fn()
}));

describe('Page Enabled component', () => {

    const MOCK_DISPATCH = jest.fn();
    const MOCK_MATCH = { url: '/' };

    const DEFAULT_PROPS = {
        dispatch: MOCK_DISPATCH,
        match: MOCK_MATCH,
        location: {
            state: {}
        }
    };

    beforeEach(() => {
        MOCK_DISPATCH.mockReset();
        MOCK_DISPATCH.mockReturnValue(Promise.resolve());
    });

    it('should render with default props', () => {
        const WRAPPER = render(
            <HelmetProvider>
                <ApplicationProvider>
                    <Page {...DEFAULT_PROPS}>
                        <div>TEST</div>
                    </Page>
                </ApplicationProvider>
            </HelmetProvider>
        );
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render the error page when error passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            error: {
                title: 'Something has gone wrong',
                location: { pathname: '' },
                stack: '',
                status: 500,
                message: ''
            }
        };

        const WRAPPER = render(
            <HelmetProvider>
                <ApplicationProvider config={PROPS}>
                    <Page>
                        <div>TEST</div>
                    </Page>
                </ApplicationProvider>
            </HelmetProvider>
        );

        expect(WRAPPER).toMatchSnapshot();
    });
});

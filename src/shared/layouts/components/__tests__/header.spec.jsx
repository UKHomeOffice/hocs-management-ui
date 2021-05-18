import React from 'react';
import Header from '../header.tsx';

describe('Layout header component', () => {
    it('should render with default props', () => {
        expect(
            shallow(<Header />)
        ).toMatchSnapshot();
    });

    it('should render without crest when service is not GOV.UK', () => {
        expect(
            shallow(<Header service="Test Service" />)
        ).toMatchSnapshot();
    });
    it('should render with custom logout URL', () => {
        expect(
            shallow(<Header logoutRedirectUrl="/foo" />)
        ).toMatchSnapshot();
    });
});

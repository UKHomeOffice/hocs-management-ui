import React from 'react';
import PhaseBanner from '../phaseBanner.tsx';
import { render } from '@testing-library/react';

describe('Phase Banner component', () => {
    it('should render with default props', () => {
        expect(
            render(<PhaseBanner />)
        ).toMatchSnapshot();
    });
    it('should display the correct phase when passed', () => {
        expect(
            render(<PhaseBanner phase="BETA" />)
        ).toMatchSnapshot();
    });
    it('should display the correct feedback url when passed', () => {
        expect(
            render(<PhaseBanner feedback="http://some.domain" />)
        ).toMatchSnapshot();
    });
});

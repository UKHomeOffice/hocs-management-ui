import React from 'react';
import Body from '../body.tsx';
import { render } from '@testing-library/react';

describe('Layout body component', () => {
    it('should render with default props', () => {
        expect(
            render(<Body />)
        ).toMatchSnapshot();
    });
    it('should render with phase banner when passed', () => {
        const props = {
            phaseBanner: {
                isVisible: true
            }
        };
        expect(
            render(<Body {...props} />)
        ).toMatchSnapshot();
    });
});

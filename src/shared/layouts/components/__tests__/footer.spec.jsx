import React from 'react';
import Footer from '../footer.tsx';
import { render } from '@testing-library/react';

describe('Layout footer component', () => {
    it('should render with default props', () => {
        expect(
            render(<Footer />)
        ).toMatchSnapshot();
    });
    it('should render with links when passed', () => {
        const props = {
            links: [
                { label: 'first', target: '/first' },
                { label: 'second', target: '/second' }
            ]
        };
        expect(
            render(<Footer {...props} />)
        ).toMatchSnapshot();
    });
});

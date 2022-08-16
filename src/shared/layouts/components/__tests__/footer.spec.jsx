import React from 'react';
import Footer from '../footer.tsx';
import { render } from '@testing-library/react';
import { ApplicationProvider } from '../../../contexts/application';
// import { MemoryRouter } from 'react-router-dom';

describe('Layout footer component', () => {
    it('should render with default props', () => {
        expect(
            render(<Footer />)
        ).toMatchSnapshot();
    });
    it('should render with links when passed', () => {
        const props = {
            links: [
                { label: 'first', target: '/' },
                { label: 'second', target: '/' }
            ]
        };
        expect(
            render(<Footer {...props} />)
        ).toMatchSnapshot();
    });
});

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ErrorSummary from '../errorSummary';
import '@testing-library/jest-dom';

const errors = [
    { key: 'Error1', value: 'Error 1' },
    { key: 'Error2', value: 'Error 2' },
    { key: 'Error3', value: 'Error 3' }
];

describe('Form text component', () => {
    it('should render with default props', () => {
        expect(
            render(<ErrorSummary pageError={{}} />)
        ).toMatchSnapshot();
    });
    it('should render with heading and description when passed', () => {
        // scrollIntoView is not supported in JSDom, so we can manually add it here
        window.HTMLElement.prototype.scrollIntoView = function() {};

        render(<ErrorSummary pageError={{ error: { description: 'Displaying just a heading and description', title: 'Error summary' } }} />);
        expect(screen.getByText('Error summary')).toBeInTheDocument();
        expect(screen.getByText('Displaying just a heading and description')).toBeInTheDocument();
    });
    it('should render list of errors when passed', () => {
        // scrollIntoView is not supported in JSDom, so we can manually add it here
        window.HTMLElement.prototype.scrollIntoView = function() {};
        expect(
            render(
                <MemoryRouter>
                    <ErrorSummary pageError={{ error: { description: 'Displaying a list of the errors on the page', formErrors: errors } }} />
                </MemoryRouter >
            )
        ).toMatchSnapshot();
    });
});

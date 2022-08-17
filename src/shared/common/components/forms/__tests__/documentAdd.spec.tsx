import React from 'react';
import { render, screen } from '@testing-library/react';
import DocumentAdd from '../documentAdd';
import '@testing-library/jest-dom';

const FIELD_NAME = 'add-document';

describe('Document add component', () => {

    it('should render with default props', () => {
        const wrapper = render(<DocumentAdd name={FIELD_NAME} updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with correct label when passed', () => {
        const label = 'MY_LABEL';
        render(<DocumentAdd name={FIELD_NAME} updateState={() => null} label={label} />);

        expect(screen.getByText('MY_LABEL')).toBeInTheDocument();
    });

    it('should render with validation error when passed', () => {
        const error = 'MY_ERROR';
        render(<DocumentAdd name={FIELD_NAME} updateState={() => null} error={error} />);
        expect(screen.getByText('MY_ERROR')).toBeInTheDocument();
    });

    it('should render with hint when passed', () => {
        const hint = 'MY_HINT';
        render(<DocumentAdd name={FIELD_NAME} updateState={() => null} hint={hint} />);
        expect(screen.getByText('MY_HINT')).toBeInTheDocument();
    });
});

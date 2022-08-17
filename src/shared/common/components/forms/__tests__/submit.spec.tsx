import React from 'react';
import { render } from '@testing-library/react';
import Submit from '../submit';

describe('Form button component', () => {
    it('should render with default props', () => {
        expect(
            render(<Submit />)
        ).toMatchSnapshot();
    });
    it('should render disabled when isDisabled is passed', () => {
        expect(
            render(<Submit disabled />)
        ).toMatchSnapshot();
    });
    it('should render with correct when label is passed', () => {
        expect(
            render(<Submit label="Submit my form" />)
        ).toMatchSnapshot();
    });
    it('should render with additional styles when className is passed', () => {
        expect(
            render(<Submit className="start" />)
        ).toMatchSnapshot();
    });
});

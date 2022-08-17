import React from 'react';
import { render } from '@testing-library/react';
import { advanceTo, clear } from 'jest-date-mock';
import DateInput from '../date';

describe('Form date component', () => {
    beforeAll(() => {
        advanceTo(new Date(2021, 2, 4, 0, 0, 0));
    });

    afterAll(() => {
        clear();
    });

    it('should render with default props', () => {
        expect(
            render(<DateInput name="date-field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<DateInput name="date-field" value="2018-01-19" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<DateInput name="date-field" label="My text field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<DateInput name="date-field" hint="Put some text in the box below" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<DateInput name="date-field" error="Some error message" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<DateInput name="date-field" disabled={true} updateState={() => null} />)
        ).toMatchSnapshot();
    });
});

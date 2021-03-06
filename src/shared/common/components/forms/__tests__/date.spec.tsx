import React from 'react';
import { render, shallow } from 'enzyme';
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
    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <DateInput name="date" updateState={mockCallback} />
        );

        let event = { target: { value: '19' } };
        mockCallback.mockReset();
        wrapper.find('#date-day').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ name: 'date', value: '--19' });

        mockCallback.mockReset();
        event = { target: { value: '01' } };
        wrapper.find('#date-month').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ name: 'date', value: '-01-19' });

        mockCallback.mockReset();
        event = { target: { value: '2018' } };
        wrapper.find('#date-year').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ name: 'date', value: '2018-01-19' });
    });
});

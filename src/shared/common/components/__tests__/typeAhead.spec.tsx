import React from 'react';
import TypeAhead from '../typeAhead';
import { render } from '@testing-library/react';

const choices = [
    { label: 'Child 1', value: 'PARENT_1_CHILD_1' },
    { label: 'Child 2', value: 'PARENT_1_CHILD_2' }
];

const getOptions = () => Promise.resolve(choices);

describe('Form type ahead component (dropdown)', () => {
    it('should render with default props', () => {
        expect(
            render(<TypeAhead getOptions={getOptions} name="type-ahead" onSelectedItemChange={() => null} />)
        ).toMatchSnapshot();
    });

    it('should render with label when passed', () => {
        expect(
            render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                label="Type-ahead"
            />)
        ).toMatchSnapshot();
    });

    it('should render with hint when passed', () => {
        expect(
            render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                hint="Select an option"
            />)
        ).toMatchSnapshot();
    });

    it('should render with error when passed', () => {
        expect(
            render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                error="Some error message"
            />)
        ).toMatchSnapshot();
    });

    it('should render disabled when passed', () => {
        expect(
            render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                disabled={true}
            />)
        ).toMatchSnapshot();
    });

});

describe('Form type ahead component (select)', () => {
    it('should render with default props', () => {
        expect(
            render(<TypeAhead getOptions={getOptions} name="type-ahead" onSelectedItemChange={() => null} />)
        ).toMatchSnapshot();
    });

    it('should render with label when passed', () => {
        expect(
            render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                label="Type-ahead"
            />)
        ).toMatchSnapshot();
    });

    it('should render with hint when passed', () => {
        expect(
            render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                hint="Select an option"
            />)
        ).toMatchSnapshot();
    });

    it('should render with error when passed', () => {
        expect(
            render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                error="Some error message"
            />)
        ).toMatchSnapshot();
    });

    it('should render disabled when passed', () => {
        expect(
            render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                disabled={true}
            />)
        ).toMatchSnapshot();
    });
});

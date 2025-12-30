import React from 'react';
import TypeAhead from '../typeAhead';
import { act, render } from '@testing-library/react';

const choices = [
    { label: 'Child 1', value: 'PARENT_1_CHILD_1' },
    { label: 'Child 2', value: 'PARENT_1_CHILD_2' }
];

const getOptions = () => Promise.resolve(choices);

describe('Form type ahead component (dropdown)', () => {
    it('should render with default props', async () => {
        const wrapper = await act(
            async () => render(
                <TypeAhead
                    getOptions={getOptions}
                    name="type-ahead"
                    onSelectedItemChange={() => null}
                />
            )
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with label when passed', async () => {
        const wrapper = await act(
            async () => render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                label="Type-ahead"
            />)
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with hint when passed', async () => {
        const wrapper = await act(
            async () => render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                hint="Select an option"
            />)
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with error when passed', async () => {
        const wrapper = await act(
            async () => render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                error="Some error message"
            />)
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should render disabled when passed', async () => {
        const wrapper = await act(
            async () => render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                disabled={true}
            />)
        );

        expect(wrapper).toMatchSnapshot();
    });

});

describe('Form type ahead component (select)', () => {
    it('should render with default props', async () => {
        const wrapper = await act(
            async () => render(
                <TypeAhead
                    getOptions={getOptions}
                    name="type-ahead"
                    onSelectedItemChange={() => null}
                />
            )
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with label when passed', async () => {
        const wrapper = await act(
            async () => render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                label="Type-ahead"
            />)
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with hint when passed', async () => {
        const wrapper = await act(
            async () =>
                render(<TypeAhead
                    getOptions={getOptions}
                    name="type-ahead"
                    onSelectedItemChange={() => null}
                    hint="Select an option"
                />)
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render with error when passed', async () => {
        const wrapper = await act(
            async () => render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                error="Some error message"
            />)
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render disabled when passed', async () => {
        const wrapper = await act(
            async () => render(<TypeAhead
                getOptions={getOptions}
                name="type-ahead"
                onSelectedItemChange={() => null}
                disabled={true}
            />)
        );

        expect(wrapper).toMatchSnapshot();
    });
});

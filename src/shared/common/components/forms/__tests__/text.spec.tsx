import React from 'react';
import { render } from '@testing-library/react';
import Text from '../text';

describe('Form text component', () => {
    it('should render with default props', () => {
        expect(
            render(<Text name="text-field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<Text name="text-field" value="field value" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<Text name="text-field" label="My text field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<Text name="text-field" hint="Put some text in the box below" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<Text name="text-field" error="Some error message" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<Text name="text-field" disabled={true} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render of type when passed', () => {
        expect(
            render(<Text name="text-field" type="password" updateState={() => null} />)
        ).toMatchSnapshot();
    });
});

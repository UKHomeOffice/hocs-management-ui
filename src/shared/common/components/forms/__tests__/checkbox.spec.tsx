import React from 'react';
import { render } from '@testing-library/react';
import Checkbox from '../checkbox';

describe('Form checkbox component', () => {
    it('should render with value true', () => {
        expect(
            render(<Checkbox label="Label1-ticked" name="Name1" updateState={() => null} value="true" />)
        ).toMatchSnapshot();
    });

    it('should render with value false', () => {
        expect(
            render(<Checkbox label="Label2-not-ticked" name="Name2" updateState={() => null} value="false" />)
        ).toMatchSnapshot();
    });
});

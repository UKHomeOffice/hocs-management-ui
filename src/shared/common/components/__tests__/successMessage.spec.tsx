import React from 'react';
import { render } from '@testing-library/react';

import SuccessMessage from '../successMessage';
import { Location } from 'history';

const mockLocation: Location = {
    state: {
        successMessage: '__successMessage__'
    },
    pathname: '',
    search: '',
    hash: ''
};

describe('when the SuccessMessage is rendered', () => {
    it('should show the success message', () => {
        expect(
            render(<SuccessMessage location={mockLocation} />)
        ).toMatchSnapshot();
    });
    it('should not display when there is not a message', () => {
        mockLocation.state = undefined;
        expect(
            render(<SuccessMessage location={mockLocation} />)
        ).toMatchSnapshot();
    });
});

import React from 'react';
import Error from '../error.tsx';
import { render } from '@testing-library/react';


describe('Error component', () => {
    it('should render with default props', () => {
        expect(
            render(<Error />)
        ).toMatchSnapshot();
    });
    it('should render with location when passed', () => {
        const props = {
            error: {
                location: {
                    pathname: '/some/unknown/path'
                }
            }
        };
        expect(
            render(<Error {...props} />)
        ).toMatchSnapshot();
    });
    it('should render with location when 404 passed', () => {
        const props = {
            error: {
                status: 404,
                location: {
                    pathname: '/SOME/UNSUPPORTED/ENDPOINT'
                }
            }
        };
        expect(
            render(<Error {...props} />)
        ).toMatchSnapshot();
    });
    it('should render with location when 403 passed', () => {
        const props = {
            error: {
                status: 403,
                location: {
                    pathname: '/SOME/UNSUPPORTED/ENDPOINT'
                }
            }
        };
        expect(
            render(<Error {...props} />)
        ).toMatchSnapshot();
    });
    it('should render with a stack trace when passed', () => {
        const props = {
            error: {
                stack: 'Stack trace...'
            }
        };
        expect(
            render(<Error {...props} />)
        ).toMatchSnapshot();
    });
});

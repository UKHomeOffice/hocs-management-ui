import { render, shallow } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../dashboard';

describe('dashboard component', () => {
    it('should not render dcu creation link if does not role', () => {
        const config = {
            hasRole: jest.fn().mockReturnValue(false)
        };

        const OUTER = shallow(<Dashboard />);
        const Page = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter><Page {...config}></Page></MemoryRouter>
        );
        expect(WRAPPER).toMatchSnapshot();
    });
    it('should render dcu creation link if has role', () => {
        const config = {
            hasRole: jest.fn().mockReturnValue(true)
        };

        const OUTER = shallow(<Dashboard />);
        const Page = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter><Page {...config}></Page></MemoryRouter>
        );
        expect(WRAPPER).toMatchSnapshot();
    });
});

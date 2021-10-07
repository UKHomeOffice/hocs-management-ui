import { render, shallow } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../dashboard';

describe('dashboard component', () => {
    it('should not render dcu creation or FOI interested parties link if does not have any roles', () => {
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
    it('should render DCU creation link if user has DCU role', () => {
        const config = {
            hasRole: jest.fn().mockImplementation((role) => {
                if(role === 'DCU') {
                    return true;
                }

                return false;
            })
        };

        const OUTER = shallow(<Dashboard />);
        const Page = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter><Page {...config}></Page></MemoryRouter>
        );
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render FOI interested parties link if user has FOI role', () => {
        const config = {
            hasRole: jest.fn().mockImplementation((role) => {
                if(role === 'FOI') {
                    return true;
                }

                return false;
            })
        };

        const OUTER = shallow(<Dashboard />);
        const Page = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter><Page {...config}></Page></MemoryRouter>
        );
        expect(WRAPPER).toMatchSnapshot();
    });
});

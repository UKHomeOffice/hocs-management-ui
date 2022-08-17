import { act, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../dashboard';
import { ApplicationProvider } from '../../../contexts/application';

let wrapper: RenderResult;

const renderComponent = (roles: string[] = []) => {
    const config = {
        csrf: '',
        layout: {
            body: { phaseBanner: { feedback: '', isVisible: true, phase: '' } },
            countDownForSeconds: 5,
            defaultTimeoutSeconds: 10,
            footer: { isVisible: true, links: [] },
            header: {
                isVisible: true,
                service: 'service name',
                serviceLink: '',
            },
        },
        user: {
            roles: roles
        }
    };
    return render(
        <ApplicationProvider config={config}>
            <MemoryRouter>
                <Dashboard/>
            </MemoryRouter>
        </ApplicationProvider>
    );
};

describe('dashboard component', () => {
    it('should not render dcu creation or FOI interested parties link if does not have any roles', () => {

        act(() => {
            wrapper = renderComponent();
        });

        expect(wrapper.container).toMatchSnapshot();
    });
    it('should render DCU creation link if user has DCU role', () => {
        const roles = ['DCU'];
        act(() => {
            wrapper = renderComponent(roles);
        });

        expect(wrapper.container).toMatchSnapshot();
    });

    it('should render FOI links if the user has the FOI role', () => {
        const roles = ['FOI'];
        act(() => {
            wrapper = renderComponent(roles);
        });

        expect(wrapper.container).toMatchSnapshot();
    });
});

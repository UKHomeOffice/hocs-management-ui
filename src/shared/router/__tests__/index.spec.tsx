import React from 'react';
import { mount } from 'enzyme';
import Router from '../index';
import { ApplicationProvider } from '../../../shared/contexts/application';
import Config, { LayoutConfig } from '../../models/config';
import { MemoryRouter } from 'react-router/index';
import WrappedDashboard from '../../pages/dashboard/dashboard';

describe('Test router routes', () => {
    const layoutConfig: LayoutConfig = {
        body: { phaseBanner: { feedback: '', isVisible: true, phase: '' } },
        countDownForSeconds: 0,
        defaultTimeoutSeconds: 0,
        footer: { isVisible: true, links: [] },
        header: { isVisible: true, service: '', serviceLink: '' }
    };

    const testConfig: Config = {
        csrf: '',
        layout: layoutConfig
    };

    it('should render with default props', () => {
        const wrapper = mount(
            <MemoryRouter>
                <ApplicationProvider config={testConfig}>
                    <Router/>
                </ApplicationProvider>
            </MemoryRouter>
        );

        expect(wrapper).toBeDefined();
        expect(wrapper.find(WrappedDashboard)).toHaveLength(1);
    });

    it('should render the amend trof campaign route', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[ '/manage-trof-campaigns/ITEM_UUID/amend' ]}>
                <ApplicationProvider config={testConfig}>
                    <Router/>
                </ApplicationProvider>
            </MemoryRouter>
        );

        expect(wrapper).toBeDefined();
        expect(wrapper.find('h1.govuk-heading-xl').text()).toEqual('Amend campaign');
    });

    it('should render the campaigns trof campaign route', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[ '/manage-trof-campaigns' ]}>
                <ApplicationProvider config={testConfig}>
                    <Router/>
                </ApplicationProvider>
            </MemoryRouter>
        );

        expect(wrapper).toBeDefined();
        expect(wrapper.find('h1.govuk-heading-xl').text()).toEqual('View and edit campaigns');
    });

    it('should render the campaigns trof campaign route', () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[ '/manage-trof-campaigns/add' ]}>
                <ApplicationProvider config={testConfig}>
                    <Router/>
                </ApplicationProvider>
            </MemoryRouter>
        );

        expect(wrapper).toBeDefined();
        expect(wrapper.find('h1.govuk-heading-xl').text()).toEqual('Add Campaign');
    });
});

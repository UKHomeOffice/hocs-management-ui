import React from 'react';
import { shallow } from 'enzyme';
import SessionTimer from '../sessionTimer';
import { ApplicationProvider } from '../../../contexts/application';

describe('Session timer component', () => {

    it('should render with default props', () => {
        const config = {
            analytics: undefined,
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
                roles: []
            }
        };
        expect(
            shallow(<ApplicationProvider config={config}>
                <SessionTimer />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render the modal when timing out', () => {
        jest.spyOn(React, 'useContext').mockReturnValue({
            layout: {
                countDownForSeconds: 5,
                defaultTimeoutSeconds: 4,
                header: {
                    service: 'service name'
                }
            }
        });

        expect(
            shallow(<SessionTimer />)
        ).toMatchSnapshot();
    });
    it('should render the modal when timed out', () => {
        jest.spyOn(React, 'useContext').mockReturnValue({
            layout: {
                countDownForSeconds: 5,
                defaultTimeoutSeconds: 0,
                header: {
                    service: 'service name'
                }
            }
        });

        expect(
            shallow(<SessionTimer />)
        ).toMatchSnapshot();
    });
});

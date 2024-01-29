import React, { Component, Fragment } from 'react';
import Header from './components/header';
import Body from './components/body';
import Footer from './components/footer';
import Notification from './notification';
import { ApplicationConsumer } from '../contexts/application';
import { LayoutConfig } from '../models/config';
import ApiStatus from '../models/apiStatus';

interface LayoutProps {
    apiStatus: ApiStatus;
    children: React.ReactNode;
    layout: LayoutConfig;
}

interface Props {
    children: React.ReactNode;
}

class Layout extends Component<LayoutProps> {

    constructor(props: LayoutProps) {
        super(props);
    }

    render() {
        const {
            apiStatus,
            children,
            layout: { header, body, footer }
        } = this.props;
        return (
            <Fragment>
                {apiStatus && <Notification {...apiStatus} />}
                <Header {...header} />
                <Body {...body}>
                    {children}
                </Body>
                {footer.isVisible && <Footer {...footer} />}
            </Fragment>
        );
    }
}

const WrappedLayout: React.FC<Props> = ({ children }) => (
    <ApplicationConsumer>
        {
            ({ apiStatus, layout }) => <Layout children={children} layout={layout!} apiStatus={apiStatus!} />
        }
    </ApplicationConsumer>
);

export default WrappedLayout;

import React, { Component, Fragment } from 'react';
import { Location } from 'history';
import { ApplicationConsumer } from '../contexts/application';
import { unsetError, clearApiStatus, ContextAction } from '../contexts/actions/index';
import Error, { ErrorContent } from './error';
import SuccessMessage from '../common/components/successMessage';
import { Helmet } from 'react-helmet-async';

interface PageWrapperProps {
    children: React.ReactNode;
    dispatch(action: ContextAction<any>): Promise<any>;
    error?: ErrorContent;
    match: any;
    location: Location;
    title: string;
}

class PageWrapper extends Component<PageWrapperProps> {

    constructor(props: PageWrapperProps) {
        super(props);
    }

    componentWillUnmount() {
        const { dispatch, error } = this.props;
        if (error) {
            dispatch(unsetError()).then(() => dispatch(clearApiStatus()));
        }
    }

    render() {
        const { children, error, location, title } = this.props;
        return (
            <Fragment>
                {typeof window !== 'undefined' && <Helmet>
                    <title>{title}</title>
                </Helmet>}
                {error ? <Error error={error} /> : <>
                    <SuccessMessage location={location} />
                    {children}
                </>
                }
            </Fragment>
        );
    }
}
interface PageEnabledWrapperProps {
    children: React.ReactElement;
    match: any;
    location: Location;
    title: string;
}

const PageEnabledWrapper: React.FC<PageEnabledWrapperProps> = ({ location, title, ...rest }) => (
    <ApplicationConsumer>
        {({ dispatch, error }) => (
            <PageWrapper
                {...rest}
                location={location}
                dispatch={dispatch!}
                error={error}
                title={title}
            />
        )}
    </ApplicationConsumer>
);

export default PageEnabledWrapper;

import React, { Component, Fragment } from 'react';
import { Location } from 'history';
import { ApplicationConsumer } from '../contexts/application';
import { unsetError, clearApiStatus, ContextAction } from '../contexts/actions/index';
import Error, { ErrorContent } from './error';
import SuccessMessage from '../common/components/successMessage';

interface PageWrapperProps {
    dispatch(action: ContextAction<any>): Promise<any>;
    error?: ErrorContent;
    match: any;
    location: Location;
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
        const { children, error, location } = this.props;
        return (
            <Fragment>
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
}

const PageEnabledWrapper: React.FC<PageEnabledWrapperProps> = ({ location, ...rest }) => (
    <ApplicationConsumer>
        {({ dispatch, error }) => (
            <PageWrapper
                {...rest}
                location={location}
                dispatch={dispatch!}
                error={error}
            />
        )}
    </ApplicationConsumer>
);

export default PageEnabledWrapper;

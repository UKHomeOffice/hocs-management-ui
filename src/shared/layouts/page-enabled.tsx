import React, { Component, Fragment } from 'react';
import { Location } from 'history';
import { ApplicationConsumer } from '../contexts/application';
import { unsetError, clearApiStatus, ContextAction } from '../contexts/actions/index';
import Error, { ErrorContent } from './error';
import SuccessMessage from '../common/components/successMessage';

interface PageWrapperProps {
    dispatch(action: ContextAction<any>): Promise<any>;
    // todo: not any
    track: any;
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

    // tslint:disable-next-line: function-name
    UNSAFE_componentWillReceiveProps(nextProps: PageWrapperProps) {
        const { track } = this.props;
        const nextPage = nextProps.match.url;

        if (nextProps.error && nextProps.error.status) {
            track('PAGE_VIEW', { title: `Error: ${nextProps.error.status}`, path: nextPage });
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
        {({ dispatch, error, track }) => (
            <PageWrapper
                {...rest}
                location={location}
                dispatch={dispatch!}
                track={track}
                error={error}
            />
        )}
    </ApplicationConsumer>
);

export default PageEnabledWrapper;

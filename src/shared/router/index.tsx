import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Layout from '../layouts/layout';
import routes from './routes/index';
import PageWrapper from '../layouts/page-enabled';
import { ApplicationConsumer, ApplicationState } from '../contexts/application';


interface RouterParams {
    hasRole: (role: string) => boolean;
}

const Router : React.FC<RouterParams> = ({ hasRole }) => (
    <Layout>
        <Switch>
            {routes.map(({ path, exact, component: Page, requiredRole, ...rest }, i) => {
                if (requiredRole && !hasRole(requiredRole)) {
                    return (<Route key={i} path={path} exact={exact} render={() => (
                        <Redirect push to='/' />
                    )} />);
                }

                return (
                    <Route
                        key={i}
                        path={path}
                        exact={exact}
                        render={props => (
                            <PageWrapper match={props.match} location={props.location}>
                                <Page {...props} {...rest} />
                            </PageWrapper>
                        )}
                    />
                );
            })}
        </Switch>
    </Layout>
);

const WrappedRouter = () => (
    <ApplicationConsumer>
        {({ hasRole }: ApplicationState) => (
            <Router hasRole={hasRole}/>
        )}
    </ApplicationConsumer>
);


export default WrappedRouter;

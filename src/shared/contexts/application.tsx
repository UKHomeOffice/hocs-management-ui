import React, { Component } from 'react';
import ReactGA from 'react-ga';
import types from './actions/types';
import { ContextAction } from './actions/index';
import { ErrorContent } from '../layouts/error';
import Config, { AnalyticsConfig, LayoutConfig } from '../models/config';
import ApiStatus from '../models/apiStatus';

export interface ApplicationState {
    analytics?: AnalyticsConfig;
    apiStatus?: ApiStatus;
    csrf?: string;
    dispatch(action: ContextAction<any>): Promise<any>;
    error?: ErrorContent;
    layout?: LayoutConfig;
    track?(event: string, payload: any): void;
    hasRole(role: string): boolean;
    hasOneOfRoles(roles: string[]): boolean;
}

interface ApplicationProps {
    children: React.ReactElement;
    config: Config;
}

const defaultState: ApplicationState = {
    dispatch: () => Promise.resolve(),
    hasRole: (_: string) => { return false; },
    hasOneOfRoles: (_: string[]) => { return false; }
};

export const Context = React.createContext<ApplicationState>(defaultState);

const reducer = (state: ApplicationState, action: ContextAction<any>): ApplicationState => {
    let newState;
    switch (action.type) {

        case types.UNSET_ERROR:
            newState = { ...state, error: undefined };
            break;
        case types.CLEAR_API_STATUS:
            newState = { ...state, apiStatus: undefined };
            break;
        case types.UPDATE_API_STATUS:
            newState = { ...state, apiStatus: { ...action.payload } };
            break;
        default:
            console.warn('Unsupported action');
            newState = state;
    }
    return newState;
};

export class ApplicationProvider extends Component<ApplicationProps, ApplicationState> {
    useAnalytics = false;

    constructor(props: ApplicationProps) {
        super(props);
        const { config } = props;

        if (config && config.analytics) {
            ReactGA.initialize(config.analytics.tracker, { titleCase: true, gaOptions: { userId: config.analytics.userId } });

            this.useAnalytics = true;
        }

        this.state = {
            ...props.config,
            apiStatus: undefined,
            dispatch: (action: ContextAction<any>) => {
                try {
                    this.setState(state => reducer(state, action));
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error);
                }
            },
            track: this.track.bind(this),
            hasRole: (role) => {
                return config.user?.roles.includes(role) || false;
            },
            hasOneOfRoles: (roles: string[]) => {
                return roles.some(role => config.user?.roles.includes(role)) || false;
            }
        };
    }

    track(event: string, payload: any) {
        if (this.useAnalytics) {
            switch (event) {
                case 'EVENT':
                    ReactGA.event({
                        category: payload.category,
                        action: payload.action,
                        label: payload.label
                    });
                    break;
                case 'PAGE_VIEW':
                    ReactGA.pageview(
                        payload.path,
                        undefined,
                        payload.title
                    );
                    break;
                default:
            }
        }
    }

    render() {
        const { children } = this.props;
        return (
            <Context.Provider value={this.state}>
                {children}
            </Context.Provider>
        );
    }

}

export const ApplicationConsumer = Context.Consumer;

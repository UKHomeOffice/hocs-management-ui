import React from 'react';
import Axios from 'axios';
import { ApplicationProvider } from './contexts/application';
import Router from './router/index';
import Config from './models/config';
import SessionTimer from './layouts/components/sessionTimer';

interface AppProps {
    config: Config;
}

const App: React.FC<AppProps> = ({ config }) => {

    const { csrf } = config;

    Axios.defaults.headers.common = {
        'x-csrf-token': csrf
    };

    return (
        <ApplicationProvider config={config}>
            <>
                <SessionTimer></SessionTimer>
                <Router />
            </>
        </ApplicationProvider>
    );
};

export default App;

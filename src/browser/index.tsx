import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../shared/index';
import '../styles/app.scss';

document.body.className = 'govuk-template__body js-enabled';
hydrateRoot(
    document.getElementById('app')!,
    <BrowserRouter>
        <HelmetProvider>
            <App config={(window as any).__INITIAL_DATA__} />
        </HelmetProvider>
    </BrowserRouter>
);

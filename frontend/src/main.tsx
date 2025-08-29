import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import { MsalProvider } from "@azure/msal-react";
import { type Configuration,  PublicClientApplication } from "@azure/msal-browser";

// Mantine styles imports
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

import './main.css'

import App from './App.tsx'

import './i18n.ts';

// Custom global styles overrides
const themeOverride = createTheme({
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  autoContrast: true,
  cursorType: 'pointer',
});


// MSAL configuration
const configuration: Configuration = {
    auth: {
        clientId: "ab9faf06-dbf6-464e-86ac-8143396d920d",
        authority: "https://login.microsoftonline.com/986a3974-67bd-4338-af77-835ff0f8b550"
    }
};

const pca = new PublicClientApplication(configuration);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={pca}>
      <MantineProvider theme={themeOverride} defaultColorScheme='dark'>
        <BrowserRouter>
          <App />
          <Notifications />
        </BrowserRouter>
      </MantineProvider>
    </MsalProvider>
  </StrictMode>,
)

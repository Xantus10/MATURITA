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

import classes from './styles/defPropsStyles.module.css'
import './main.css'

import App from './App.tsx'

import './i18n.ts';

/**
 * Custom global styles overrides
 */
const themeOverride = createTheme({
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  autoContrast: true,
  cursorType: 'pointer',
  components: {
    Button: {
      defaultProps: {
        classNames: {root: classes.button},
        variant: "gradient",
        gradient: {from: 'rgba(145,145,145,1)', to: 'rgba(66,66,66,1)'}
      }
    }
  },
  other: {
    bodyoverride: 'rgba(242, 222, 202, 0.8)'
  }
});


/**
 * MSAL configuration
 */
const configuration: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_MS_APP_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MS_TENANT}`
    }
};

const pca = new PublicClientApplication(configuration);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={pca}>
      <MantineProvider theme={themeOverride} cssVariablesResolver={(theme) => ({variables: {}, light: {'--mantine-color-body': theme.other.bodyoverride, '--input-bg': theme.other.bodyoverride}, dark: {}})} defaultColorScheme='dark'>
        <BrowserRouter>
          <App />
          <Notifications position='bottom-right' />
        </BrowserRouter>
      </MantineProvider>
    </MsalProvider>
  </StrictMode>,
)

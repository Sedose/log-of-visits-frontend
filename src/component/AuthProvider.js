import React, { 
  useState,
  useEffect,
} from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

import config from '../Confing';
import { getUserDetails } from '../application/GraphService';
import backendApi from '../api/backend-api';

export default (WrappedComponent) => () => {
  const [error, setError] = useState({ message: null, debug: null });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const accounts = publicClientApplication.getAllAccounts();
    if (accounts?.length > 0 && !isAuthenticated) {
      getUserProfile();
    }
  }, []);

  const publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: config.appId,
      redirectUri: config.redirectUri,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: true,
    },
  });

  const getAccessToken = (scopes) => Promise.resolve(
    publicClientApplication.getAllAccounts(),
  )
    .then((accounts) => acquireTokenSilentOrFail(accounts, scopes, publicClientApplication))
    .catch((err) => acquireTokenPopupOrFail(err, scopes, publicClientApplication))
    .then(({ accessToken }) => accessToken);

  const getUserProfile = async () => {
    try {
      const accessToken = await getAccessToken(config.scopes);
      if (accessToken) {
        const appUser = await getUserDetails(accessToken);
        setIsAuthenticated(true);
        setUser({
          displayName: appUser.displayName,
          email: appUser.mail || appUser.userPrincipalName,
          timeZone: appUser.mailboxSettings.timeZone,
          timeFormat: appUser.mailboxSettings.timeFormat,
        });
        setError({ message: null, debug: null });
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser({});
      setError(normalizeError(err));
    }
  };

  const setErrorMessage = (message, debug) => {
    setError({ message, debug });
  };

  const appLogin = async () => {
    const accessToken = await getAccessToken(config.scopes);
    try {
      const appUserDetails = await backendApi.retrieveUserDetails(accessToken);
      setUser((prevState) => ({ ...prevState, appRole: appUserDetails.userRole }));
      setError({ message: null, debug: null });
      return appUserDetails.userRole;
    } catch (err) {
      console.log(err);
    }
  };

  const login = async () => {
    try {
      await publicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: 'select_account',
      });
      await getUserProfile();
    } catch (err) {
      setIsAuthenticated(false);
      setUser({});
      setError(normalizeError(err));
    }
  };

  const logout = () => {
    publicClientApplication.logout();
  };

  const normalizeError = (err) => {
    let normalizedError;
    if (typeof err === 'string') {
      const errParts = err.split('|');
      normalizedError = errParts.length > 1
        ? { message: errParts[1], debug: errParts[0] }
        : { message: err };
    } else {
      normalizedError = {
        message: err.message,
        debug: JSON.stringify(err),
      };
    }
    return normalizedError;
  };

  return (
    <WrappedComponent
      error={error}
      isAuthenticated={isAuthenticated}
      user={user}
      login={() => login()}
      logout={() => logout()}
      appLogin={() => appLogin()}
      getAccessToken={(scopes) => getAccessToken(scopes)}
      setError={(message, debug) => setErrorMessage(message, debug)}
      {...WrappedComponent.props}
    />
  );
};

function acquireTokenSilentOrFail(accounts, scopes, publicClientApplication) {
  return accounts.length > 0
    ? publicClientApplication.acquireTokenSilent({ scopes, account: accounts[0] })
    : Promise.reject(new Error('login_required'));
}

function acquireTokenPopupOrFail(err, scopes, publicClientApplication) {
  return (isInteractionRequired(err)
    ? publicClientApplication.acquireTokenPopup({ scopes })
    : Promise.reject(err));
}

const isInteractionRequired = (err) => {
  if (!err.message || err.message.length <= 0) {
    return false;
  }

  return (
    err.message.includes('consent_required')
    || err.message.includes('interaction_required')
    || err.message.includes('login_required')
    || err.message.includes('no_account_in_silent_request')
  );
};

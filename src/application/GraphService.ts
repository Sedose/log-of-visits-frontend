const graph = require('@microsoft/microsoft-graph-client');

const getAuthenticatedClient = (accessToken: string) => graph.Client.init({
  authProvider: (done: any) => {
    done(null, accessToken);
  },
});

export const getUserDetails = async (
  accessToken: string,
) => getAuthenticatedClient(accessToken)
  .api('/me')
  .select('displayName,mail,mailboxSettings,userPrincipalName')
  .get();

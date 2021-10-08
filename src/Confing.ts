const config = {
  appId: '7b04f22c-3217-4611-addd-79562e5c6488',
  redirectUri: process.env.AUTH_REDIRECT_URI || 'http://localhost:3000',
  scopes: [
    'user.read',
    'mailboxsettings.read',
    'calendars.readwrite',
  ],
};

export default config;

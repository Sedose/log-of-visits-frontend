const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyTarget = process.env.BACKEND_API_URL;

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: proxyTarget || 'http://localhost:8080',
      changeOrigin: true,
    }),
  );
};

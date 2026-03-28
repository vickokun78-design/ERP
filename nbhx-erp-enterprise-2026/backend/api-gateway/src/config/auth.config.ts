export default () => ({
  AUTH: {
    JWT: {
      SECRET: process.env.JWT_SECRET || 'nbhx-super-secret-key-2026-jwt-secure',
      EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
      REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'nbhx-refresh-secret-key-2026',
      REFRESH_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    },
    
    MFA: {
      ENABLED: process.env.MFA_ENABLED === 'true',
      ISSUER: process.env.MFA_ISSUER || 'NBHX ERP',
      WINDOW: 1, // TOTP window
    },
    
    OAUTH: {
      CLIENT_ID: process.env.OAUTH_CLIENT_ID || 'nbhx-erp-client',
      CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || 'nbhx-erp-secret-2026',
      CALLBACK_URL: process.env.OAUTH_CALLBACK_URL || 'http://localhost:4000/auth/callback',
    },
    
    AZURE_AD: {
      TENANT_ID: process.env.AZURE_TENANT_ID,
      CLIENT_ID: process.env.AZURE_CLIENT_ID,
      CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    },
    
    // Session configuration
    SESSION: {
      SECRET: process.env.SESSION_SECRET || 'nbhx-session-secret-2026',
      MAX_AGE: 24 * 60 * 60 * 1000, // 24 horas
    },
  },
});

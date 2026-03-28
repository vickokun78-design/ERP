export default () => ({
  DATABASE: {
    HOST: process.env.DB_HOST || 'postgres',
    PORT: parseInt(process.env.DB_PORT, 10) || 5432,
    USER: process.env.DB_USER || 'nbhx_admin',
    PASSWORD: process.env.DB_PASSWORD || 'NbhxSecure2026!',
    NAME: process.env.DB_NAME || 'nbhx_erp',
    URL: process.env.DATABASE_URL || 'postgresql://nbhx_admin:NbhxSecure2026!@postgres:5432/nbhx_erp',
    
    // Pool configuration
    POOL: {
      MIN: parseInt(process.env.DB_POOL_MIN, 10) || 5,
      MAX: parseInt(process.env.DB_POOL_MAX, 10) || 20,
      IDLE_TIMEOUT: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
      CONNECTION_TIMEOUT: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 5000,
    },
  },
});

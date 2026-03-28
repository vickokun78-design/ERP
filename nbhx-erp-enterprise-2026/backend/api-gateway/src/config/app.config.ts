export default () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 4000,
  API_PREFIX: process.env.API_PREFIX || 'api',
  API_VERSION: process.env.API_VERSION || 'v1',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Rate Limiting
  API_RATE_LIMIT: parseInt(process.env.API_RATE_LIMIT, 10) || 1000,
  API_RATE_LIMIT_WINDOW: parseInt(process.env.API_RATE_LIMIT_WINDOW, 10) || 900000,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'json',
  
  // Features
  AUDIT_LOG_ENABLED: process.env.AUDIT_LOG_ENABLED === 'true',
  
  // Microservicios URLs
  SERVICES: {
    AUTH: process.env.AUTH_SERVICE_URL || 'http://auth-service:4001',
    PRODUCTION: process.env.PRODUCTION_SERVICE_URL || 'http://production-service:4002',
    INVENTORY: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:4003',
    QUALITY: process.env.QUALITY_SERVICE_URL || 'http://quality-service:4004',
    ENGINEERING: process.env.ENGINEERING_SERVICE_URL || 'http://engineering-service:4005',
    HR: process.env.HR_SERVICE_URL || 'http://hr-service:4006',
    FINANCE: process.env.FINANCE_SERVICE_URL || 'http://finance-service:4007',
    BI: process.env.BI_SERVICE_URL || 'http://bi-service:4008',
    ADMIN: process.env.ADMIN_SERVICE_URL || 'http://admin-service:4009',
    AI: process.env.AI_SERVICE_URL || 'http://ai-service:4010',
  },
});

export default () => ({
  SECURITY: {
    // Encriptación
    ENCRYPTION: {
      KEY: process.env.ENCRYPTION_KEY || 'nbhx-encryption-key-32-chars!!',
      ALGORITHM: 'aes-256-gcm',
    },
    
    // Helmet configuration
    HELMET: {
      ENABLED: process.env.HELMET_ENABLED !== 'false',
    },
    
    // CSRF
    CSRF: {
      ENABLED: process.env.CSRF_PROTECTION === 'true',
      SECRET: process.env.CSRF_SECRET || 'nbhx-csrf-secret-2026',
    },
    
    // Password policy
    PASSWORD: {
      MIN_LENGTH: 12,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBERS: true,
      REQUIRE_SPECIAL: true,
      MAX_AGE_DAYS: 90,
      HISTORY_COUNT: 5,
    },
    
    // Account lockout
    LOCKOUT: {
      MAX_ATTEMPTS: 5,
      LOCKOUT_DURATION_MINUTES: 30,
    },
    
    // Session security
    SESSION: {
      SECURE_COOKIES: process.env.NODE_ENV === 'production',
      HTTP_ONLY: true,
      SAME_SITE: 'strict',
    },
  },
});

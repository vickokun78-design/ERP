export default () => ({
  REDIS: {
    HOST: process.env.REDIS_HOST || 'redis',
    PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || 'Redis2026!',
    URL: process.env.REDIS_URL || 'redis://:Redis2026!@redis:6379',
    
    // TTL configurations (en segundos)
    TTL: {
      DEFAULT: 3600, // 1 hora
      SESSION: 86400, // 24 horas
      CACHE: 1800, // 30 minutos
      RATE_LIMIT: 900, // 15 minutos
    },
  },
});

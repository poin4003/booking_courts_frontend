const dev = {
  app: {
    main_api: import.meta.env.VITE_MAIN_API_ENDPOINT || 'http://localhost:3055',
  },
};

const prod = {
  app: {
    main_api: import.meta.env.VITE_MAIN_API_ENDPOINT || 'http://localhost:3055',
  },
};

const config = { dev, prod };
const env = import.meta.env.NODE_ENV || 'dev';

console.log('Config:', config[env]);

export default config[env];
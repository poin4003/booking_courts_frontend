const development = {
  app: {
    main_api: import.meta.env.VITE_MAIN_API_ENDPOINT || 'http://localhost:3055',
  },
};

const production = {
  app: {
    main_api: import.meta.env.VITE_MAIN_API_ENDPOINT || 'http://localhost:3055',
  },
};

const config = { development, production };
const env = import.meta.env.NODE_ENV || 'development';

console.log('Config:', config[env]);

export default config[env];
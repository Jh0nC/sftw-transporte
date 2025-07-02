import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3002),
  
  // Database
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  
  // External Services
  USERS_SERVICE_URL: Joi.string().required(),
  COMPANIES_SERVICE_URL: Joi.string().required(),
  VEHICLES_SERVICE_URL: Joi.string().required(),
  
  // Maps & GPS
  GOOGLE_MAPS_API_KEY: Joi.string().optional(),
});

export const envVariables = () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3002,
  
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  
  services: {
    users: process.env.USERS_SERVICE_URL,
    companies: process.env.COMPANIES_SERVICE_URL,
    vehicles: process.env.VEHICLES_SERVICE_URL,
  },
  
  maps: {
    googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
});

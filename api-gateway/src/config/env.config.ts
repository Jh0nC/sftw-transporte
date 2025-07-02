import 'dotenv/config';
import * as joi from 'joi';

// Define la interfaz que describe las variables de entorno esperadas.
interface EnvVariables {
  GATEWAY_PORT: number;

  AUTH_SERVICE_URL: string;
  USERS_SERVICE_URL: string;
  COMPANIES_SERVICE_URL: string;
  STATES_SERVICE_URL: string;
  TRAVEL_ORDERS_SERVICE_URL: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;

  RATE_LIMIT_TTL: number;
  RATE_LIMIT_LIMIT: number;

  JWT_SECRET: string;

  CORS_ORIGIN: string;
  LOG_LEVEL: string;
}

/* 
  Define un esquema de validación utilizando Joi 
  para asegurarse de que las variables de entorno
  cumplen con los requisitos esperados. 
  */
const envVariablesSchema = joi
  .object<EnvVariables>({
    GATEWAY_PORT: joi.number().required(),

    AUTH_SERVICE_URL: joi.string().required(),
    USERS_SERVICE_URL: joi.string().required(),
    COMPANIES_SERVICE_URL: joi.string().required(),
    STATES_SERVICE_URL: joi.string().required(),
    TRAVEL_ORDERS_SERVICE_URL: joi.string().required(),

    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.number().required(),
    REDIS_PASSWORD: joi.string().optional(),

    RATE_LIMIT_TTL: joi.number().required(),
    RATE_LIMIT_LIMIT: joi.number().required(),

    JWT_SECRET: joi.string().min(32).required(),

    CORS_ORIGIN: joi.string().required(),
    LOG_LEVEL: joi.string().valid('error', 'warn', 'info', 'debug').required(),
  })
  .unknown(true);

// Función para cargar y validar las variables de entorno utilizando el esquema definido.
const loadAndValidateEnv = (): EnvVariables => {
  // Valida las variables de entorno actuales contra el esquema.
  const { error, value } = envVariablesSchema.validate(process.env, {
    allowUnknown: true,
  });
  if (error) {
    // Si hay un error en la validación, lanza una excepción con los detalles.
    throw new Error(`Environment config validation error: ${error.message}`);
  }
  // Si la validación es exitosa, retorna las variables como un objeto tipado.
  return value as EnvVariables;
};

// Carga y valida las variables de entorno.
const env = loadAndValidateEnv();

// Exporta las variables de entorno en un formato más amigable para su uso dentro de la aplicación.
export const envVariables = {
  gatewayPort: env.GATEWAY_PORT,

  authServiceUrl: env.AUTH_SERVICE_URL,
  usersServiceUrl: env.USERS_SERVICE_URL,
  companiesServiceUrl: env.COMPANIES_SERVICE_URL,
  statesServiceUrl: env.STATES_SERVICE_URL,
  travelOrdersServiceUrl: env.TRAVEL_ORDERS_SERVICE_URL,

  redisHost: env.REDIS_HOST,
  redisPort: env.REDIS_PORT,
  redisPassword: env.REDIS_PASSWORD,

  rateLimitTtl: env.RATE_LIMIT_TTL,
  rateLimitLimit: env.RATE_LIMIT_LIMIT,

  jwtSecret: env.JWT_SECRET,

  corsOrigin: env.CORS_ORIGIN.split(','),
  logLevel: env.LOG_LEVEL,
};

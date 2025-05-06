import 'dotenv/config';
import * as joi from 'joi';

// Define la interfaz que describe las variables de entorno esperadas.
interface EnvVariables {
  APP_PORT: number;

  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;

  // ... other variables
}

/* 
  Define un esquema de validación utilizando Joi 
  para asegurarse de que las variables de entorno
  cumplen con los requisitos esperados. 
  */

const envVariablesSchema = joi
  .object<EnvVariables>({
    APP_PORT: joi.number().required(),

    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_NAME: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),

    // ... other variables
  })
  .unknown(false);

/* 
  ...}).unknown({bool})
  Permite variables adicionales no definidas en el esquema. 
  */

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
  appPort: env.APP_PORT,

  dbHost: env.DB_HOST,
  dbPort: env.DB_PORT,
  dbName: env.DB_NAME,
  dbUsername: env.DB_USERNAME,
  dbPassword: env.DB_PASSWORD,

  // ... other variables
};

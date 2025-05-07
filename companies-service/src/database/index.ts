/* 
  % Entidades funcionales
  > A las siguientes entidades se les asiganara un 
  > Repository en sus respectivos servicios
*/

// admin_companies
export * from './companies/admin_companies.entity'

// client_companies
export * from './companies/client_companies.entity'

// company_identification_types
export * from './company-identifiction-types/company_identification_types.entity'

/* 
  % Entidades de referencia
  > En este servicio estas entidades unicamente
  > son de referencia, no cumplen ninguna otra funcion
*/

// states
export * from './states.entity'

// document_types
export * from './document-types/document_types.entity'

// users
export * from './users/users.entity'
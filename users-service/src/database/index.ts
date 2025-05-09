/* 
  % Entidades funcionales
  > A las siguientes entidades se les asiganara un 
  > Repository en sus respectivos servicios
*/

// document_types
export * from './document-types/document_types.entity'

// permissions
export * from './permissions/permissions.entity'

// roles
export * from './roles/roles.entity'

// users
export * from './users/users.entity'
export * from './users/users_secondary_data.entity'

// users -> dependence
export * from './users/dependence/drivers.entity'
export * from './users/dependence/users_administratives.entity'

// transactional: users_admin_companies
export * from './companies/users-admin-companies.entity'

/* 
  % Entidades de referencia
  > En este servicio estas entidades unicamente
  > son de referencia, no cumplen ninguna otra funcion
*/

// states
export * from './states.entity'

// companies
export * from './companies/company_identification_types.entity'
export * from './companies/admin_companies.entity'
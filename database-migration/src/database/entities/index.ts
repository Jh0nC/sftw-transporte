/* 
  % archivo > index < 
  > Este archivo cumple el proposito de centralizar
  > las entidades para la eficiencia y facilidad en el
  > manetenimiento.
*/

export * from './states.entity';

//? Related Users
export * from './users/users.entity';
export * from './users/users_secondary_data.entity';
export * from './users/dependence/users_administratives.entity';
export * from './users/dependence/drivers.entity';
export * from './users/document_types.entity';
export * from './users/auth/roles.entity';
export * from './users/auth/permissions.entity';

//? Related Companies
export * from './companies/company_identification_types.entity';
export * from './companies/admin_companies.entity';
export * from './companies/client_companies.entity';

//? Related Travel Orders
export * from './travels/travel_orders.entity';
export * from './travels/travel_current_location.entity';
export * from './travels/travel_news.entity';
export * from './travels/delivery_points/travel_stop_points.entity';
export * from './travels/delivery_points/delivery_documents.entity';

//? Related Vehicles
export * from './vehicles/vehicles.entity';
export * from './vehicles/vehicle_documents.entity';
export * from './vehicles/load_capacity_categories.entity';
export * from './vehicles/load_type_categories.entity';

/*
  % Entidades de transacción creadas automaticamente >>> TypeORM

  > roles - permissions...
    * { roles_permissions }

  > users - roles...
    *

  > users - admin_companies...
    *

  > travel_orders - vehicles...
    *

  > client_companies - travel_orders...
    *

  > ...

*/

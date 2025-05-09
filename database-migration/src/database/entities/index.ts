/* 
  % archivo > index < 
  > Este archivo cumple el proposito de centralizar
  > las entidades para la eficiencia y facilidad en el
  > manetenimiento.
*/

export * from './states.entity';

//> Transaccionals
export * from './companies/users-admin-companies.entity'

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

//? Related Categories
export * from './categories/load_capacity_categories.entity';
export * from './categories/load_type_categories.entity';

//? Related Vehicles
export * from './vehicles/vehicles.entity';
export * from './vehicles/vehicle_documents.entity';

/*
  % Entidades de transacción creadas automaticamente >>> TypeORM

  > roles - permissions...
    * { roles_permissions }

  > users - roles...
    * { users_roles }

  > drivers - vehicles
    * { drivers_vehicles }

  > users - admin_companies...
    * { users_admin_companies }

  > travel_orders - vehicles...
    * { travel_orders_vehicles }

  > client_companies - travel_orders...
    * { travel_orders_client_companies }

*/

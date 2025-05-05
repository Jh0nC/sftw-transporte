import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  AdminCompanies,
  ClientCompanies,
  LoadCapacityCategories,
  LoadTypeCategories,
  States,
  TravelCurrentLocation,
  TravelNews,
  TravelStopPoints,
  Vehicles,
} from '../';

@Entity('travel_orders')
export class TravelOrders {
  @PrimaryGeneratedColumn()
  id_travel_order: number;

  /* 
    Relation with admin_companies
    */
  @ManyToOne(() => AdminCompanies, 
    (adminCompany) => adminCompany.travel_orders)
  admin_company: AdminCompanies;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  state: States;

  /* 
    Relation with load_capacity_categories
    */
  @ManyToOne(() => LoadCapacityCategories,
    (loadCapacityCategory) => loadCapacityCategory.travel_orders)
  load_capacity_category: LoadCapacityCategories;

  /* 
    relation with load_type_category
    */
  @ManyToOne(() => LoadTypeCategories,
    (loadTypeCategory) => loadTypeCategory.travel_orders)
  load_type_category: LoadTypeCategories;

  @Column({ type: 'datetime' })
  start_datetime: Date;

  @Column({ type: 'datetime' })
  end_datetime: Date;

//>---------------------------------------------------------------->
  /*
    * TypeORM transactional auto-created tables
  
    > This are the atribute reference to transactional tables
    */

  /* 
    Relation with vehicles
    */
  @ManyToMany(() => Vehicles, (vehicle) => vehicle.travel_orders)
  @JoinTable({ name: 'travel_orders_vehicles' })
  vehicles: Vehicles[];

  /* 
    Relation with client_companies
    */
  @ManyToMany(() => ClientCompanies,
    (clientCompany) => clientCompany.travel_orders)
  @JoinTable({ name: 'travel_orders_client_companies' })
  client_companies: ClientCompanies[];

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with travel_current_location
    */
  @OneToOne(() => TravelCurrentLocation,
    (travelCurrentLocation) => travelCurrentLocation.travel_order)
  travel_current_location: TravelCurrentLocation;

  /* 
    Relation with travel_news
    */
  @OneToMany(() => TravelNews, (travelNew) => travelNew.travel_order)
  travel_news: TravelNews[];

  /* 
    Relation with travel_stop_points
    */
  @OneToMany(() => TravelStopPoints,
    (travelStopPoint) => travelStopPoint.travel_order)
  travel_stop_points: TravelStopPoints[];
}

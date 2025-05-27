import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import {
  AdminCompanies,
  LoadCapacityCategories,
  States,
  VehicleDocuments,
  LoadTypeCategories,
  Drivers,
  TravelOrders,
} from '../';

@Entity('vehicles')
export class Vehicles {
  @PrimaryGeneratedColumn()
  id_vehicle: number;

  /* 
    Relation with admin_companies
    */
  @ManyToOne(() => AdminCompanies, 
    (adminCompany) => adminCompany.vehicles)
  @JoinColumn({ name: 'admin_company'})
  admin_company: AdminCompanies;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  @JoinColumn({ name: 'state'})
  state: States;

  /*  
    Relation with load_capacity_categories
    */
  @ManyToOne(() => LoadCapacityCategories,
    (capacityCategory) => capacityCategory.vehicles)
  @JoinColumn({ name: 'load_capacity_category'})
  load_capacity_category: LoadCapacityCategories;

  /*  
    Relation with load_type_categories
    */
  @ManyToOne(() => LoadTypeCategories, 
    (typeCategory) => typeCategory.vehicles)
  @JoinColumn({ name: 'load_type_category'})
  load_type_category: LoadTypeCategories;

  @Column({ length: 150 })
  model: string;

  @Column({ length: 50 })
  color: string;

//>---------------------------------------------------------------->
  /*
    * TypeORM transactional auto-created tables
  
    > This are the atribute reference to transactional tables
    */

  /* 
    Relation with drivers
    */
  @ManyToMany(() => Drivers, (driver) => driver.vehicles)
  drivers: Drivers[];

  /* 
    Relation with travel_orders
    */
  @ManyToMany(() => TravelOrders, 
    (travelOrder) => travelOrder.vehicles)
  travel_orders: TravelOrders[];

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with vehicle_documents
    */
  @OneToOne(() => VehicleDocuments,
    (vehicleDocument) => vehicleDocument.vehicle)
  vehicle_documents: VehicleDocuments;
}

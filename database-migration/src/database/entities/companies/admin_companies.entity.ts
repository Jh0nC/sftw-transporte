import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  States,
  CompanyIdentificationType,
  Users,
  TravelOrders,
  Vehicles,
  Roles,
} from '../';

@Entity()
export class AdminCompanies {
  @PrimaryGeneratedColumn()
  id_companie: number;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  state: States;

  /*  
    Relation with company_identificationTypes
    */
  @ManyToOne(() => CompanyIdentificationType,
    (identificationType) => identificationType.adminCompanies)
  identification_type: CompanyIdentificationType;

  @Column({ length: 30 })
  identification_number: string;

  @Column({ length: 100 })
  company_name: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 20 })
  phone_number: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 200 })
  legal_representative: string;

  @Column({ length: 30 })
  representative_document: string;

  @Column()
  verified_email: boolean;

  @Column({ type: 'json' })
  json_string_config: any;

//>---------------------------------------------------------------->
  /*
    * TypeORM transactional auto-created tables
    
    > This are the atribute reference to transactional tables
    */

  /* 
    Relation with users
    */
  @ManyToMany(() => Users, (user) => user.admin_companies)
  users: Users[];

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with roles
    */
  @OneToMany(() => Roles, (role) => role.admin_company)
  roles: Roles[];

  @OneToMany(() => TravelOrders, (travelOrder) => travelOrder.company)
  travelOrders: TravelOrders[];

  @OneToMany(() => Vehicles, (vehicle) => vehicle.company)
  vehicles: TravelOrders[];
}

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  States,
  DocumentTypes,
  Roles,
  UsersSecondaryData,
  AdminCompanies,
  UserAdministratives,
  Drivers,
  UsersAdminCompanies,
} from '../';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id_user: number;

  /*  
    Relation with document_types
    */
  @ManyToOne(() => DocumentTypes, 
    (documentType) => documentType.users)
  document_type: DocumentTypes;

  @Column({ length: 30 })
  document_number: string;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  state: States;

  @Column({ length: 150 })
  user_first_name: string;

  @Column({ length: 150 })
  user_last_name: string;

  @Column({ length: 20 })
  phone_number: string;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 50 })
  email: string;

  //? Bcrypt: crea una string de exactamente 60 caracteres al hacer hash 10
  @Column({ length: 60 })
  password: string;

  @Column({ type: 'boolean', default: false })
  verified_email: boolean;

//>---------------------------------------------------------------->
  /*
    * TypeORM transactional auto-created tables
  
    > This are the atribute reference to transactional tables
    */

  /* 
    Relation with roles
    */
  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Transaccional relation with admin_companies
    */
  @OneToMany(() => UsersAdminCompanies, 
    (userAdminCompany) => userAdminCompany.user)
  user_admin_company: UsersAdminCompanies[];


  /* 
    Relation with the secondary data of the user
    */
  @OneToOne(() => UsersSecondaryData,
    (userSecondaryData) => userSecondaryData.user)
  user_secondary_data: UsersSecondaryData;

  /* 
    Relation with drivers
    */
  @OneToOne(() => Drivers, (driver) => driver.user)
  driver: Drivers[];

  /* 
    Relation with users_administratives
    */
  @ManyToOne(() => UserAdministratives,
    (userAdministrative) => userAdministrative.user)
  user_administrative: UserAdministratives;
}

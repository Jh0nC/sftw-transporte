import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
} from '../';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id_user: number;

  /*  
    Relation with document_types
    */
  @ManyToOne(() => DocumentTypes, (documentType) => documentType.users)
  document_type: DocumentTypes;

  @Column({ length: 30 })
  document_number: string;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  state: States;

  @Column({ length: 100 })
  user_first_name: string;

  @Column({ length: 100 })
  user_last_name: string;

  @Column({ length: 20 })
  phone_number: string;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 60 }) //? Bcrypt: create a 60 long character string with Hash 10
  password: string;

  @Column({})
  verfied_email: boolean;

//>---------------------------------------------------------------->
  /*
    * TypeORM transactional auto-created tables
  
    > This are the atribute reference to transactional tables
    */

  /* 
    Relation with roles
    */
  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable({ name: 'users_roles' }) //? Name for transactional table
  roles: Roles[];

  /* 
    Relation with companies
    */
  @ManyToMany(() => AdminCompanies, (adminCompany) => adminCompany.users)
  @JoinTable({ name: 'users_companies' }) //? Name for transactional table
  admin_companies: AdminCompanies[];

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with the secondary data of the user
    */
  @OneToOne(() => UsersSecondaryData,
    (userSecondaryData) => userSecondaryData.user)
  user_secondary_data: UsersSecondaryData;

  /* 
    Relation with users_administratives
    */
  @ManyToOne(() => UserAdministratives,
    (userAdministrative) => userAdministrative.user)
  user_administrative: UserAdministratives;

  /* 
    Relation with drivers
    */
  @OneToOne(() => Drivers, (driver) => driver.user)
  driver: Drivers[];
}

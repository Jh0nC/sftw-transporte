import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  States,
  DocumentTypes,
  AdminCompanies,
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
    Relation with companies
    */
  @ManyToMany(() => AdminCompanies, (adminCompany) => adminCompany.users)
  @JoinTable({ name: 'users_admin_companies' })
  admin_companies: AdminCompanies[];
}

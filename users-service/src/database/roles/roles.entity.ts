import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminCompanies, Permissions, States, Users } from '../';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  id_role: number;

  /* 
    Relation with admin_compamnies
    */
  @ManyToOne(() => AdminCompanies, 
    (adminCompany) => adminCompany.roles)
  admin_company: AdminCompanies;

  @ManyToOne(() => States, (state) => state.id_state)
  state_id: States;

  @Column({ length: 100 })
  role_name: string;

//>---------------------------------------------------------------->
  /*
  * TypeORM transactional auto-created tables
    
    > This are the atribute reference to transactional tables
    */

  /* 
    Relation with permissions
    */
  @ManyToMany(() => Permissions, (permission) => permission.roles)
  @JoinTable({ name: 'roles_permissions' })
  permissions: Permissions[];

  /* 
    Relation with users
    */
  @ManyToMany(() => Users, (user) => user.roles)
  users: Users[];
}

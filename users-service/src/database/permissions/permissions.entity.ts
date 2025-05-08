import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles, States } from '../';

@Entity('permissions')
export class Permissions {
  @PrimaryGeneratedColumn()
  id_permission: number;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  state: States;

  @Column({ length: 150 })
  permission_name: string;

  @Column({ length: 255 })
  description: string;

  //>---------------------------------------------------------------->
  /*
    * TypeORM transactional auto-created tables
  
    > This are the atribute reference to transactional tables
    */

  /* 
    Relation with roles
    */
  @ManyToMany(() => Roles, (role) => role.permissions)
  roles: Roles[];
}

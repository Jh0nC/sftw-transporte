import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../../';

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn()
  id_permission: number;

  @Column({ length: 100 })
  permission_name: string;

  @Column({ length: 255 })
  description: string;

//*---------------------------------------------------------------->
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

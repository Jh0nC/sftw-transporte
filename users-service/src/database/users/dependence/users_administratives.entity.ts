import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../..';

@Entity('user_administratives')
export class UserAdministratives {
  @PrimaryGeneratedColumn()
  id_user_administrative: number;

  /* 
    Relation with users
    */
  @OneToMany(() => Users, 
    (user) => user.user_administrative)
  user: Users[];

  @Column({ length: 150 })
  job_title: string;

  @Column({ length: 150 })
  dependence: string;
}

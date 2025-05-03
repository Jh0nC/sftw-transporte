import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../..';

@Entity()
export class UserAdministratives {
  @PrimaryGeneratedColumn()
  id_user_administrative: number;

  /* 
    Relation with users
    */
  @OneToMany(() => Users, (user) => user.user_administrative)
  user: Users[];

  @Column({ length: 100 })
  job_title: string;

  @Column({ length: 100 })
  dependence: string;
}

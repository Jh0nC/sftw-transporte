import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { States, Users } from '../..';

@Entity('user_administratives')
export class UserAdministratives {
  @PrimaryGeneratedColumn()
  id_user_administrative: number;

  /* 
    Relation with users
    */
  @ManyToOne(() => Users, (user) => user.user_administrative)
  @JoinColumn()
  user: Users[];

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  @JoinColumn()
  state: States;

  @Column({ length: 150 })
  job_title: string;

  @Column({ length: 150 })
  dependence: string;
}

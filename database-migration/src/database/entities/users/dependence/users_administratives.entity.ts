import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
  @JoinColumn({ name: 'user'})
  user: Users[];

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  @JoinColumn({ name: 'state'})
  state: States;

  @Column({ length: 150 })
  job_title: string;

  @Column({ length: 150 })
  dependence: string;
}

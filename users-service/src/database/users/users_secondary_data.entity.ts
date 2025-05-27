import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../';

@Entity('user_secondary_data')
export class UsersSecondaryData {
  @PrimaryGeneratedColumn()
  id_user_secondary_data: number;

  /* 
    Relation with user
    */
  @OneToOne(() => Users, (user) => user.user_secondary_data)
  @JoinColumn({ name: 'user'})
  user: Users;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ length: 50 })
  gender: string;

  @Column({ length: 255, nullable: true })
  profile_photo: string;

  @Column({ type: 'datetime' })
  last_session_open: Date;

  @Column({ type: 'datetime' })
  register_date: Date;

  @Column({ type: 'datetime' })
  last_data_update: Date;

  @Column({ length: 255 })
  document_photo: string;
}

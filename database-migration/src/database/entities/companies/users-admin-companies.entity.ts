import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.entity';
import { AdminCompanies } from './admin_companies.entity';
import { States } from '../states.entity';

@Entity('users_admin_companies')
export class UsersAdminCompanies {
  @PrimaryGeneratedColumn()
  id_user_admin_company: number;

  /* 
    Transaccional relation with users
    */
  @ManyToOne(() => Users, (user) => user.user_admin_company)
  @JoinColumn({ name: 'user'})
  user: Users[];

  /* 
    Transaccional relation with admin companies
    */
  @ManyToOne(() => AdminCompanies,
    (adminCompany) => adminCompany.user_admin_company)
  @JoinColumn({ name: 'admin_companies'})
  admin_companies: AdminCompanies[];

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  @JoinColumn({ name: 'state'})
  state: States;
}

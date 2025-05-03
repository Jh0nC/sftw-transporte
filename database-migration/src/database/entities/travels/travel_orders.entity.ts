import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { AdminCompanies, ClientCompanies, States, TravelStopPoints } from '../';

@Entity()
export class TravelOrders {
  @PrimaryGeneratedColumn()
  id_travel_order: number;

  @Column({ length: 20 })
  total_weight: string;

  @Column({ length: 50 })
  load_type: string;

  @ManyToOne(() => AdminCompanies, (companie) => companie.travelOrders)
  company: AdminCompanies;

  @ManyToOne(() => States)
  state: States;

  @ManyToMany(() => ClientCompanies, (companie) => companie.travelOrders)
  @JoinTable({ name: 'travel_orders_client_companies' })
  clientCompany: ClientCompanies[];

  @OneToMany(
    () => TravelStopPoints,
    (travelStopPoint) => travelStopPoint.travelOrder,
  )
  travelStopPoints: TravelStopPoints[];
}

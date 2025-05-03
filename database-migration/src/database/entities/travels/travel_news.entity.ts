import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DateTimeColumn,
} from 'typeorm';
import { TravelOrders } from './travel_orders.entity';

@Entity()
export class TravelNews {
  @PrimaryGeneratedColumn()
  id_travel_new: number;

  @ManyToOne(() => TravelOrders)
  @JoinColumn({ name: 'travel_order_id' })
  travel_order: TravelOrders;

  @Column({ length: 255 })
  description: string;

  @Column({ length: 255 })
  on_location: string;

  @DateTimeColumn()
  registered_datetime: Date;
}

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TravelOrders } from './travel_orders.entity';

@Entity()
export class TravelNews {
  @PrimaryGeneratedColumn()
  id_travel_new: number;

  /* 
    Relation with travel_orders
    */
  @ManyToOne(() => TravelOrders, (travelOrder) => travelOrder.travel_news)
  @JoinColumn()
  travel_order: TravelOrders;

  @Column({ length: 255 })
  description: string;

  @Column({ length: 255 })
  on_location_latitude: string;

  @Column({ length: 255 })
  on_location_longitude: string;

  @Column({ type: 'datetime' })
  registered_datetime: Date;
}

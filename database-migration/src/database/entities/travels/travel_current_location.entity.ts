import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TravelOrders } from '../';

@Entity('travel_current_location')
export class TravelCurrentLocation {
  @PrimaryGeneratedColumn()
  id_current_location: number;

  /* 
    Relation with travel_orders
    */
  @OneToOne(() => TravelOrders,
    (travelOrder) => travelOrder.travel_current_location)
  @JoinColumn({ name: 'travel_order'})
  travel_order: TravelOrders;

  @Column({ length: 255 })
  latitude: string;

  @Column({ length: 255 })
  longitude: string;
}

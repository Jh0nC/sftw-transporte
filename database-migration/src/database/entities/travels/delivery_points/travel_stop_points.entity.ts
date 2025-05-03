import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { TravelOrders, States } from '../..';

@Entity()
export class TravelStopPoints {
  @PrimaryGeneratedColumn()
  id_travel_stop_point: number;
  
  @Column()
  index_point: number;
  
  @Column({ length: 255 })
  delivery_location: string;

  @ManyToOne(() => States, (state) => state.id_state)
  state: States;

  @ManyToOne(() => TravelOrders, (travelOrder) => travelOrder.travelStopPoints)
  travelOrder: TravelOrders;
}

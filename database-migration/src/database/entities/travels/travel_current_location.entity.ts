import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TravelOrders } from './travel_orders.entity'; // Asegúrate de que la ruta sea correcta

@Entity()
export class TravelCurrentLocation {
  @PrimaryGeneratedColumn()
  id_current_location: number;

  @ManyToOne(() => TravelOrders)
  @JoinColumn({ name: 'travel_order_id' })
  travel_order: TravelOrders;

  @Column({ length: 255 })
  live_location: string;
}
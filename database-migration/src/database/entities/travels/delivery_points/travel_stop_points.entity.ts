import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TravelOrders, States, DeliveryDocuments } from '../../';

@Entity('travel_stop_points')
export class TravelStopPoints {
  @PrimaryGeneratedColumn()
  id_travel_stop_point: number;

  /* 
    Relation with travel_orders
    */
  @ManyToOne(() => TravelOrders,
    (travelOrder) => travelOrder.travel_stop_points)
  @JoinColumn()
  travel_order: TravelOrders;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  @JoinColumn()
  state: States;

  @Column()
  index_point: number;

  @Column({ length: 255 })
  latitude: string;

  @Column({ length: 255 })
  longitude: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 255 })
  location: string;

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with delivery_documents
    */
  @OneToOne(() => DeliveryDocuments,
    (deliveryDocument) => deliveryDocument.travel_stop_point)
  delivery_documents: DeliveryDocuments;
}

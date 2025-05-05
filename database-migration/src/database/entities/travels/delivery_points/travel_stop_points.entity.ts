import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { TravelOrders, States, DeliveryDocuments } from '../../';

@Entity()
export class TravelStopPoints {
  @PrimaryGeneratedColumn()
  id_travel_stop_point: number;

  /* 
    Relation with travel_orders
    */
  @ManyToOne(() => TravelOrders, (travelOrder) => travelOrder.travel_stop_points)
  travel_order: TravelOrders;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  state: States;
  
  @Column()
  index_point: number;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  address: string;

  @Column()
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

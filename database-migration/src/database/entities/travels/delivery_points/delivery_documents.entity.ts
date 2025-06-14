import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TravelStopPoints } from '../../';

@Entity('delivery_documents')
export class DeliveryDocuments {
  @PrimaryGeneratedColumn()
  id_delivery_document: number;

  /* 
    Relation with travel_stop_points
    */
  @OneToOne(() => TravelStopPoints,
    (travelStopPoint) => travelStopPoint.delivery_documents)
  @JoinColumn({ name: 'travel_stop_point'})
  travel_stop_point: TravelStopPoints;

  @Column({ length: 255 })
  delivery_certificate: string;

  @Column({ length: 255 })
  comprobant_photo: string;
}

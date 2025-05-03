import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TravelStopPoints } from '../../';

@Entity()
export class DeliveryDocuments {
  @PrimaryGeneratedColumn()
  id_delivery_document: number;

  @Column({ length: 255 })
  delivery_certificate: string;

  @Column({ length: 255 })
  delivery_photo: string;

  @ManyToOne(() => TravelStopPoints)
  travel_stop_point: TravelStopPoints;
}

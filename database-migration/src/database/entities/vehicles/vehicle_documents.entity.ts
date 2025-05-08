import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { States, Vehicles } from '../';

@Entity('vehicle_documents')
export class VehicleDocuments {
  @PrimaryGeneratedColumn()
  id_vehicle_documents: number;

  /* 
    Relation with vehicles
    */
  @OneToOne(() => Vehicles, 
    (vehicle) => vehicle.vehicle_documents)
  @JoinColumn()
  vehicle: Vehicles;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  state: States;

  @Column({ length: 10 })
  vehicle_plate: string;

  @Column({ length: 255 })
  soat: string;

  @Column({ length: 255 })
  technomecanical_revision: string;
}

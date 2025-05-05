import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Vehicles } from '../';

@Entity()
export class VehicleDocuments {
  @PrimaryGeneratedColumn()
  id_vehicle_documents: number;

  /* 
    Relation with vehicles
    */
  @OneToOne(() => Vehicles, (vehicle) => vehicle.vehicle_documents)
  @JoinColumn()
  vehicle: Vehicles;

  @Column({ length: 10 })
  vehicle_plate: string;

  @Column({ length: 255 })
  soat: string;

  @Column({ length: 255 })
  technomecanical_revision: string;
}

import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Vehicles } from '../';

@Entity()
export class VehicleDocuments {
  @PrimaryGeneratedColumn()
  id_vehicle_documents: number;

  @Column({ length: 20 })
  matricula: string;

  @Column({ length: 255 })
  soat: string;

  @Column({ length: 255 })
  tecnomecanica: string;

  @OneToOne(() => Vehicles, (vehicle) => vehicle.vehicleDocuments)
  vehicle: Vehicles;
}

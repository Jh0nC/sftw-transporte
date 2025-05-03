import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import {
  AdminCompanies,
  LoadCapacityCategories,
  States,
  VehicleDocuments,
  LoadTypeCategories
} from '../';

@Entity()
export class Vehicles {
  @PrimaryGeneratedColumn()
  id_vehicle: number;

  @Column({ length: 50 })
  model: string;

  @Column({ length: 20 })
  color: string;

  @ManyToOne(() => AdminCompanies, (companie) => companie.vehicles)
  company: AdminCompanies;

  @ManyToOne(() => States, (state) => state.id_state)
  state: States;

  @ManyToOne(
    () => LoadCapacityCategories,
    (capacityCategory) => capacityCategory.vehicles,
  )
  load_capacity_category: LoadCapacityCategories;

  load_type_category: LoadTypeCategories;

  @OneToOne(
    () => VehicleDocuments,
    (vehicleDocument) => vehicleDocument.vehicle,
  )
  vehicleDocuments: VehicleDocuments;
}

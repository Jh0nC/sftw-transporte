import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Drivers, Vehicles } from '../';
import { States } from '../states.entity';

@Entity('drivers_vehicles')
export class DriversVehicles {
  @PrimaryGeneratedColumn()
  id_user_admin_company: number;

  /* 
    Transaccional relation with drivers
    */
  @ManyToOne(() => Drivers, (user) => user.driver_vehicles)
  @JoinColumn({ name: 'driver' })
  driver: Drivers[];

  /* 
    Transaccional relation with vehicles
    */
  @ManyToOne(() => Vehicles, (vehicle) => vehicle.driver_vehicle)
  @JoinColumn({ name: 'vehicle' })
  vehicle: Vehicles[];

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  @JoinColumn({ name: 'state' })
  state: States;
}

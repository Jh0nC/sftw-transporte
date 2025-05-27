import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { States, Users, Vehicles } from '../..';

@Entity('drivers')
export class Drivers {
  @PrimaryGeneratedColumn()
  id_driver: number;

  /* 
    Relation with user
    */
  @OneToOne(() => Users, (user) => user.driver)
  @JoinColumn({ name: 'user'})
  user: Users;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  @JoinColumn({ name: 'state'})
  state: States;

  @Column({ length: 30 })
  driver_license_number: string;

  @Column({ length: 30 })
  driver_license_category: string;

  @Column({ type: 'date' })
  license_expiration_date: Date;

  @Column({ length: 255 })
  driving_condition_license: string;

  @Column({ length: 255 })
  driver_license_photo: string;

  //>---------------------------------------------------------------->
  /*
    * TypeORM transactional auto-created tables
  
    > This are the atribute reference to transactional tables
    */

  /* 
    Relation with vehicles
    */
  @ManyToMany(() => Vehicles, (vehicle) => vehicle.drivers)
  @JoinTable({ name: 'drivers_vehicles' })
  vehicles: Vehicles[];
}

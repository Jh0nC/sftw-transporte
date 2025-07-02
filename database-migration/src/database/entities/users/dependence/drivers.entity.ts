import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DriversVehicles, States, Users } from '../..';

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
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */


  /* 
    Transaccional relation with drivers_vehicles
    */
  @OneToMany(() => DriversVehicles, 
    (driverVehicle) => driverVehicle.driver)
  driver_vehicles: DriversVehicles[];
}

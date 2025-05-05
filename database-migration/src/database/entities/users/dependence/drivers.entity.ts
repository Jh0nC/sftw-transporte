import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users, Vehicles } from '../..';

@Entity()
export class Drivers {
  @PrimaryGeneratedColumn()
  id_driver: number;

  /* 
    Relation with user
    */
  @OneToOne(() => Users, (user) => user.driver)
  @JoinColumn()
  user: Users;

  @Column({ length: 30 })
  driver_license_number: number;

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
  @JoinTable({ name: "drivers_vehicles" })
  vehicles: Vehicles[];
}

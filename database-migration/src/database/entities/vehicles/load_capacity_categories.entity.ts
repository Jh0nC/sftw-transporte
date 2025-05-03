import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicles } from '..';

@Entity()
export class LoadCapacityCategories {
  @PrimaryGeneratedColumn()
  id_load_capacity_category: number;

  @Column({ length: 150 })
  category_name: string;

  @Column({ length: 5 })
  category_short_name: string;

  @Column({ length: 50 })
  capacity_range: string;

  @OneToMany(() => Vehicles, (vehicle) => vehicle.load_capacity_category)
  vehicles: Vehicles[];
}
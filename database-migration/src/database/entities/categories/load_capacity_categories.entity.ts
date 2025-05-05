import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TravelOrders, Vehicles } from '../';

@Entity('load_capacity_categories')
export class LoadCapacityCategories {
  @PrimaryGeneratedColumn()
  id_load_capacity_category: number;

  @Column({ length: 150 })
  category_name: string;

  @Column({ length: 7 })
  category_short_name: string;

  @Column({ length: 50 })
  capacity_range: string;

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    relation with vehicles
    */
  @OneToMany(() => Vehicles, 
    (vehicle) => vehicle.load_capacity_category)
  vehicles: Vehicles[];

  /* 
    relation with travel_orders
    */
  @OneToMany(() => TravelOrders,
    (travelOrder) => travelOrder.load_capacity_category)
  travel_orders: TravelOrders[];
}

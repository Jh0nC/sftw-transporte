import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicles, TravelOrders } from '../';

@Entity('load_type_categories')
export class LoadTypeCategories {
  @PrimaryGeneratedColumn()
  id_load_type_category: number;

  @Column({ length: 150 })
  category_name: string;

  @Column({ length: 7 })
  category_short_name: string;

  @Column({ length: 255 })
  description: string;

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with vehicles
    */
  @OneToMany(() => Vehicles, 
    (vehicle) => vehicle.load_type_category)
  vehicles: Vehicles[];

  /* 
    Relation with travel_orders
    */
  @OneToMany(() => TravelOrders,
    (travelOrder) => travelOrder.load_type_category)
  travel_orders: TravelOrders[];
}

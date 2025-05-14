import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { CompanyIdentificationType, TravelOrders } from '../';

@Entity('client_companies')
export class ClientCompanies {
  @PrimaryGeneratedColumn()
  id_client_company: number;

  /* 
    Relation with company_identification_types
    */
  @ManyToOne(() => CompanyIdentificationType,
    (identificationType) => identificationType.client_companies)
  @JoinColumn()
  identification_type: CompanyIdentificationType;

  @Column({ length: 30 })
  identification_number: string;

  @Column({ length: 150 })
  client_company_name: string;

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with travel_orders
    */
  @ManyToMany(() => TravelOrders, 
    (travelOrder) => travelOrder.client_companies)
  travel_orders: TravelOrders[];
}

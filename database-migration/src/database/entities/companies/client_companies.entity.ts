import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { CompanyIdentificationType, TravelOrders } from '../';

@Entity()
export class ClientCompanies {
  @PrimaryGeneratedColumn()
  id_client_company: number;

  /* 
    Relation with company_identification_types
    */
  @ManyToOne(() => CompanyIdentificationType,
    (identificationType) => identificationType.client_companies)
  identification_type: CompanyIdentificationType;

  @Column({ length: 30 })
  identification_number: string;

  @Column({ length: 100 })
  client_company_name: string;

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with travel_orders
    */
  @ManyToMany(() => TravelOrders, (travelOrder) => travelOrder.clientCompany)
  travel_orders: TravelOrders[];
}

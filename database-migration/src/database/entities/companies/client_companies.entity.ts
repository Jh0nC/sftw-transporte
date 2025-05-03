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

  @Column({ length: 30 })
  identification_number: string;

  @Column({ length: 100 })
  client_company_name: string;

  @ManyToOne(
    () => CompanyIdentificationType,
    (identificationType) => identificationType.clientCompanies,
  )
  identification_type: CompanyIdentificationType;

  @ManyToMany(() => TravelOrders, (travelOrder) => travelOrder.clientCompany)
  travelOrders: TravelOrders[];
}

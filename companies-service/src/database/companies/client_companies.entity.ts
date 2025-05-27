import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyIdentificationType } from '../';

@Entity('client_companies')
export class ClientCompanies {
  @PrimaryGeneratedColumn()
  id_client_company: number;

  /* 
    Relation with company_identification_types
    */
  @ManyToOne(() => CompanyIdentificationType,
    (identificationType) => identificationType.client_companies)
  @JoinColumn({ name: 'identification_type'})
  identification_type: CompanyIdentificationType;

  @Column({ length: 30 })
  identification_number: string;

  @Column({ length: 150 })
  client_company_name: string;
}

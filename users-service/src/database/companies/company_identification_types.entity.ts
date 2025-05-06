import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AdminCompanies } from '../';

@Entity('company_identification_types')
export class CompanyIdentificationType {
  @PrimaryGeneratedColumn()
  id_identification_type: number;

  @Column({ length: 150 })
  identification_type_name: string;

  @Column({ length: 7 })
  identification_type_short_name: string;

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with admin_companies
    */
  @OneToMany(() => AdminCompanies, 
    (adminCompany) => adminCompany.identification_type)
  admin_companies: AdminCompanies[];
}

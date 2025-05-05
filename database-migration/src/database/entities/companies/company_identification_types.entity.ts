import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AdminCompanies, ClientCompanies } from '../';

@Entity()
export class CompanyIdentificationType {
  @PrimaryGeneratedColumn()
  id_identification_type: number;

  @Column({ length: 150 })
  identification_type_name: string;

  @Column({ length: 5 })
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
    (companie) => companie.identification_type)
  admin_companies: AdminCompanies[];

  /* 
    Relation with client_companies
    */
  @OneToMany(() => ClientCompanies, 
    (companie) => companie.identification_type)
  client_companies: ClientCompanies[];
}
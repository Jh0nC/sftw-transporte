import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  States,
  CompanyIdentificationType,
  DocumentTypes,
  UsersAdminCompanies,
} from '../';

@Entity('admin_companies')
export class AdminCompanies {
  @PrimaryGeneratedColumn()
  id_admin_company: number;

  /* 
    Relation with states
    */
  @ManyToOne(() => States, (state) => state.id_state)
  @JoinColumn()
  state: States;

  /*  
    Relation with company_identificationTypes
    */
  @ManyToOne(() => CompanyIdentificationType,
    (identificationType) => identificationType.admin_companies)
  @JoinColumn()
  identification_type: CompanyIdentificationType;

  @Column({ length: 30 })
  identification_number: string;

  @Column({ length: 150 })
  company_name: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 20 })
  phone_number: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 200 })
  legal_representative: string;

  /* 
    Relation with document_types
    */
  @ManyToOne(() => DocumentTypes,
    (documentType) => documentType.admin_companies)
  @JoinColumn()
  representative_document_type: DocumentTypes;

  @Column({ length: 30 })
  representative_document: string;

  @Column({ type: 'boolean', default: false })
  verified_email: boolean;

  @Column({ type: 'json', nullable: true })
  json_string_config: any;

  /*
    ? Falta por definir la configuracion que se manejara en front 
    > Se debe crear una interfaz para adaptar el tipo de dato
    Ejemplo:
    
    interface JsonConfig {
      propiedad1: string;
      ...
    }

    @Column({ type: 'json', nullable: true })
    json_string_config: JsonConfig;
  
  */

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Transaccional relation with admin_companies
    */
  @OneToMany(() => UsersAdminCompanies, 
    (userAdminCompany) => userAdminCompany.user)
  user_admin_company: UsersAdminCompanies[];
}

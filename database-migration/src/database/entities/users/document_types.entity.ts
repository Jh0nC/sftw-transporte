import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AdminCompanies, Users } from '../';

@Entity()
export class DocumentTypes {
  @PrimaryGeneratedColumn()
  id_document_type: number;

  @Column({ length: 150 })
  document_type_name: string;

  @Column({ length: 5 })
  document_type_short_name: string;

//>---------------------------------------------------------------->
  /*  
    % TypeORM reference connection atributes
    
    > This don't appear in database schema
    */

  /* 
    Relation with users
    */
  @OneToMany(() => Users, (user) => user.document_type)
  users: Users[];

  /* 
    Relation with admin_companies
    */
  @OneToMany(() => AdminCompanies, 
    (adminCompany) => adminCompany.representative_document_type)
  admin_companies: AdminCompanies[];
}

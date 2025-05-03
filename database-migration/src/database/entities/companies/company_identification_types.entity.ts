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

  @OneToMany(() => AdminCompanies, (companie) => companie.identification_type)
  adminCompanies: AdminCompanies[];

  @OneToMany(() => ClientCompanies, (companie) => companie.identification_type)
  clientCompanies: ClientCompanies[];
}
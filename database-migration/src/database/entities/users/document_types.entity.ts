import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../';

@Entity()
export class DocumentTypes {
  @PrimaryGeneratedColumn()
  id_document_type: number;

  @Column({ length: 150 })
  document_type_name: string;

  @Column({ length: 5 })
  document_type_short_name: string;

  /* 
    > Relation with users
    */
  @OneToMany(() => Users, (user) => user.document_type)
  users: Users[];
}

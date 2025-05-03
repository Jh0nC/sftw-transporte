import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class States {
  @PrimaryGeneratedColumn()
  id_state: number;

  @Column({ length: 20 })
  state_name: string;
}

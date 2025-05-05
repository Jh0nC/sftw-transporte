import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('states')
export class States {
  @PrimaryGeneratedColumn()
  id_state: number;

  @Column({ length: 30 })
  state_name: string;
}

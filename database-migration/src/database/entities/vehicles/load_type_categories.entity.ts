import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoadTypeCategories {
  @PrimaryGeneratedColumn()
  id_load_type_category: number;

  @Column({ length: 150 })
  category_name: string;

  @Column({ length: 5 })
  category_short_name: string;

  @Column({ length: 50 })
  description: string;
}

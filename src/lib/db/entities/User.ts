import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  fname?: string;

  @Column({ length: 50 })
  name!: string;

  @Column({ length: 70 })
  password!: string;

  @Column({ length: 100 })
  email!: string;
}

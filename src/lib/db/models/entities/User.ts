import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsStrongPassword, Length } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(0, 50)
  fname?: string;

  @Column()
  @Length(1, 50)
  name!: string;

  @Column({ length: 70 })
  @Length(8, 70)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;

  @Column()
  @IsEmail()
  email!: string;
}

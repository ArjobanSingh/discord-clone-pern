import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { IsEmail, Length } from 'class-validator';
@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 60,
  })
  @Length(3, 60)
  name: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  status: boolean;

  @Column({
    nullable: true,
  })
  profile_picture: string;
}

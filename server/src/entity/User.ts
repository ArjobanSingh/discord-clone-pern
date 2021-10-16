import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import bcrypt from 'bcrypt';
import { CustomError } from '../utils/errors';

@Entity('users')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 60,
  })
  @IsNotEmpty()
  @Length(3, 60)
  name: string;

  @Column({
    unique: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({
    nullable: true,
  })
  status: string;

  @Column({
    nullable: true,
  })
  profile_picture: string;

  async hashPassword() {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      throw new CustomError('Something went wrong', 500);
    }
  }

  comparePassword(unencryptedPassword: string) {
    try {
      return bcrypt.compare(unencryptedPassword, this.password);
    } catch (err) {
      throw new CustomError('Invalid credentials', 401);
    }
  }
}

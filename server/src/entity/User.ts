import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import bcrypt from 'bcrypt';
import { CustomError } from '../utils/errors';
import Server from './Server';
import ServerMember from './ServerMember';

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
  profilePicture: string;

  @Column({
    nullable: true,
  })
  profilePicturePublicId: string;

  // all those servers, whose owner is this user
  @OneToMany((type) => Server, (server) => server.owner)
  ownedServers: Server[]

  // all servers, where this user is a member
  @OneToMany((type) => ServerMember, (serverMember) => serverMember.user)
  serverMembers: ServerMember[]

  @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

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

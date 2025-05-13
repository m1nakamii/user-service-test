import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column()
  phone: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
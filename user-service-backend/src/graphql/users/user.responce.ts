import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@ObjectType()
export class UsersResponse {
  @Field(() => [User], { name: 'users' })
  users: User[];

  @Field(() => Int)
  total: number;
}
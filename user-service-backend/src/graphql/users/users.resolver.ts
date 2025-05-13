import { Resolver, Query, Args, ObjectType, Field, Int } from '@nestjs/graphql';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { GetUsersArgs } from './dto/user.args';

@ObjectType()
class UsersResponse {
  @Field(() => [User])
  list: User[];

  @Field(() => Int)
  totalUsers: number;
}

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UsersResponse, { name: 'users' })
  async getUsers(@Args() args: GetUsersArgs) {
    const result = await this.usersService.findAll(args);
    const totalUsers = await this.usersService.getTotalCount();
    
    return {
      list: result.users,
      totalUsers
    };
  }
}
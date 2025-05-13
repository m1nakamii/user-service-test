import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import { GetUsersArgs } from './dto/user.args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() args: GetUsersArgs) {
    const params = {
      page: args.page,
      limit: args.limit,
      _sortBy: args.sortBy, 
      _order: args.order
    };
    
    return this.usersService.findAll(params as any);
  }
}
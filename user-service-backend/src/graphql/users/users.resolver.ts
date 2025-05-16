import { Resolver, Query, Args, ObjectType, Field, Int } from '@nestjs/graphql';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { GetUsersArgs } from './dto/user.args';
import { Mutation } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@ObjectType()
class UsersResponse {
  @Field(() => [User])
  list: User[];

  @Field(() => Int)
  totalUsers: number;
}

@ObjectType()
class DailyUserStat {
  @Field()
  date: string;

  @Field(() => Int)
  count: number;
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
  
  @Query(() => [DailyUserStat])
  async dailyUserStats() {
    return this.usersService.getDailyUserStats();
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return this.usersService.create(data);
  }

@Mutation(() => User)
async updateUser(@Args('data') data: UpdateUserInput): Promise<User> {
  const updated = await this.usersService.update(data.id, data);
  if (!updated) {
    throw new Error(`Пользователь с ID ${data.id} не найден`);
  }
  return updated;
}
}
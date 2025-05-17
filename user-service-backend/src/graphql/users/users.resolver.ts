import { Resolver, Query, Args, ObjectType, Field, Int, Subscription, Mutation } from '@nestjs/graphql';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { GetUsersArgs } from './dto/user.args';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { pubSub } from './pubsub';

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
  async getUsers(@Args() args: GetUsersArgs): Promise<UsersResponse> {
    const result = await this.usersService.findAll(args);
    const totalUsers = await this.usersService.getTotalCount();

    return {
      list: result.users,
      totalUsers,
    };
  }

  @Query(() => [DailyUserStat])
  async dailyUserStats(): Promise<DailyUserStat[]> {
    return this.usersService.getDailyUserStats();
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    const createdUser = await this.usersService.create(data);
    await pubSub.publish('userChanged', { userChanged: createdUser });
    return createdUser;
  }

  @Mutation(() => User)
  async updateUser(@Args('data') data: UpdateUserInput): Promise<User> {
    const updatedUser = await this.usersService.update(data.id, data);
    if (!updatedUser) {
      throw new Error(`Пользователь с ID ${data.id} не найден`);
    }
    await pubSub.publish('userChanged', { userChanged: updatedUser });
    return updatedUser;
  }

  @Subscription(() => User, {
    name: 'userChanged',
  })
  userChanged() {
    return pubSub.asyncIterableIterator('userChanged');
  }
}
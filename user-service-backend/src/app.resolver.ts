import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello() {
    return 'Welcome to GraphQL API';
  }
}
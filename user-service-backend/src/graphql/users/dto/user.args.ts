import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetUsersArgs {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  order?: string;

}
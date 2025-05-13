import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetUsersArgs {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  order?: 'ASC' | 'DESC';
}
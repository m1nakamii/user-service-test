import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  fullName: string;

  @Field()
  phone: string;
}

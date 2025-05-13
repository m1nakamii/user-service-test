import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  fullName: string;

  @Field()
  phone: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  phone?: string;
}
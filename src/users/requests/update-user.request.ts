import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserRequest } from './create-user.request.js';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateUserRequest extends PartialType(CreateUserRequest) {
  @Field()
  @IsUUID()
  readonly id!: string;
}

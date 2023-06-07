import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsAlpha, MaxLength } from 'class-validator';
import { UserModel } from '../models/index.js';

@InputType()
export class CreateUserRequest extends PickType(UserModel, ['age'] as const, InputType) {
  @Field()
  @IsAlpha()
  @MaxLength(20)
  readonly name!: string;

  @Field()
  @IsAlpha()
  @MaxLength(60)
  readonly location!: string;
}

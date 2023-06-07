import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderModel } from '../../orders/index.js';

@ObjectType()
export class UserModel {
  @Field()
  readonly id!: string;

  @Field()
  readonly name!: string;

  @Field()
  readonly location!: string;

  @Field(() => Int)
  readonly age!: number;

  @Field(() => [OrderModel], { defaultValue: [] })
  readonly orders?: OrderModel[];
}

import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OrderStatus } from './order.status.js';

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderModel {
  @Field()
  readonly id!: string;

  @Field()
  readonly userId!: string;

  @Field(() => Float)
  readonly amount!: number;

  @Field(() => OrderStatus)
  readonly status!: OrderStatus;
}

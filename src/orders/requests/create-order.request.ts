import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { OrderModel } from '../models/index.js';

@InputType()
export class CreateOrderRequest extends PickType(OrderModel, ['amount'] as const, InputType) {
  @Field()
  @IsUUID('4')
  readonly userId!: string;
}

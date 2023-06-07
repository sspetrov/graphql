import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class OrderRequest {
  @Field()
  @IsUUID('4')
  readonly id!: string;
}

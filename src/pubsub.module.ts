import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export const pubsubToken = Symbol('pubsub');

@Global()
@Module({
  providers: [{ provide: pubsubToken, useValue: new PubSub() }],
  exports: [pubsubToken],
})
export class PubSubModule {}

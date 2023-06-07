import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { OrderModel } from './models/index.js';
import { OrdersService } from './orders.service.js';
import { UsersService } from '../users/users.service.js';
import { PubSub } from 'graphql-subscriptions';
import { CreateOrderRequest, OrderRequest } from './requests/index.js';
import { Inject } from '@nestjs/common';
import { pubsubToken } from '../pubsub.module.js';

@Resolver(() => OrderModel)
export class OrdersResolver {
  readonly #ordersService: OrdersService;
  readonly #usersService: UsersService;
  readonly #pubsub: PubSub;

  constructor(
    ordersService: OrdersService,
    usersService: UsersService,
    @Inject(pubsubToken) pubsub: PubSub,
  ) {
    this.#ordersService = ordersService;
    this.#usersService = usersService;
    this.#pubsub = pubsub;
  }

  @Query(() => OrderModel, { name: 'order' })
  getOrder(@Args() request: OrderRequest): OrderModel {
    const { id } = request;

    return this.#ordersService.getOrderById(id);
  }

  @Mutation(() => OrderModel)
  createOrder(@Args('createOrderRequest') request: CreateOrderRequest): OrderModel {
    const { userId } = request;

    this.#usersService.getUserById(userId);

    const order = this.#ordersService.createOrder(request);

    this.#pubsub.publish('orderCreated', { orderCreated: order });

    return order;
  }

  @Subscription(() => OrderModel)
  orderCreated() {
    return this.#pubsub.asyncIterator('orderCreated');
  }

  @Subscription(() => OrderModel)
  orderUpdated() {
    return this.#pubsub.asyncIterator('orderUpdated');
  }
}

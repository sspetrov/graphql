import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UserModel } from './models/index.js';
import { UsersService } from './users.service.js';
import { OrderModel, OrdersService } from '../orders/index.js';
import { CreateUserRequest, UpdateUserRequest, UserRequest } from './requests/index.js';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { pubsubToken } from '../pubsub.module.js';

@Resolver(() => UserModel)
export class UsersResolver {
  readonly #usersService: UsersService;
  readonly #ordersService: OrdersService;
  readonly #pubsub: PubSub;

  constructor(
    usersService: UsersService,
    ordersService: OrdersService,
    @Inject(pubsubToken) pubsub: PubSub,
  ) {
    this.#usersService = usersService;
    this.#ordersService = ordersService;
    this.#pubsub = pubsub;
  }

  @Query(() => UserModel, { name: 'user' })
  getUser(@Args() { id: userId }: UserRequest): UserModel | undefined {
    return this.#usersService.getUserById(userId);
  }

  @Query(() => [UserModel])
  users(): UserModel[] {
    return this.#usersService.getUsers();
  }

  @ResolveField('orders', () => [OrderModel])
  getUserOrders(@Parent() user: UserModel): OrderModel[] {
    const { id } = user;

    return this.#ordersService.getOrdersByUserId(id);
  }

  @Mutation(() => UserModel)
  createUser(@Args('createUserRequest') request: CreateUserRequest): UserModel {
    const user = this.#usersService.createUser(request);

    this.#pubsub.publish('userCreated', { userCreated: user });

    return user;
  }

  @Mutation(() => UserModel)
  updateUser(@Args('updateUserRequest') request: UpdateUserRequest): UserModel {
    const user = this.#usersService.updateUser(request);

    this.#pubsub.publish('userUpdated', { userUpdated: user });

    return user;
  }

  @Subscription(() => UserModel)
  userCreated() {
    return this.#pubsub.asyncIterator('userCreated');
  }

  @Subscription(() => UserModel)
  userUpdated() {
    return this.#pubsub.asyncIterator('userUpdated');
  }
}

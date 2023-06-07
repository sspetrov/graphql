import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderModel } from './models/index.js';
import { CreateOrderRequest } from './requests/create-order.request.js';
import { v4 } from 'uuid';
import { OrderStatus } from './models/order.status.js';
import { PubSub } from 'graphql-subscriptions';
import { pubsubToken } from '../pubsub.module.js';

let orders: OrderModel[] = [];

@Injectable()
export class OrdersService {
  readonly #pubsub: PubSub;

  constructor(@Inject(pubsubToken) pubsub: PubSub) {
    this.#pubsub = pubsub;
  }

  getOrderById(orderId: string): OrderModel {
    const order = orders.find((order) => order.id === orderId);

    if (!order) throw new NotFoundException('Order not found');

    return order;
  }

  getOrdersByUserId(userId: string): OrderModel[] {
    return orders.filter((order) => order.userId === userId);
  }

  createOrder(request: CreateOrderRequest): OrderModel {
    const order: OrderModel = { ...request, id: v4(), status: OrderStatus.Created };

    orders.push(order);

    setTimeout(() => {
      orders = orders.map((item) =>
        item.id === order.id ? { ...item, status: OrderStatus.Executed } : item,
      );

      this.#pubsub.publish('orderUpdated', {
        orderUpdated: { ...order, status: OrderStatus.Executed },
      });
    }, 60000);

    return order;
  }
}

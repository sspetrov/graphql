import { Module, forwardRef } from '@nestjs/common';
import { UsersResolver } from './users.resolver.js';
import { UsersService } from './users.service.js';
import { OrdersModule } from '../orders/index.js';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

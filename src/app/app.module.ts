import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';
import { OrderModule } from 'src/order/order.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/common/config/winston.config';
import { UserLoggingMiddleware } from 'src/middlewares/userLogging.middleware';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserLoggingMiddleware).forRoutes('*');
  }
}

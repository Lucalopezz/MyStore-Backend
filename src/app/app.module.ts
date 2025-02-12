import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';
import { OrderModule } from 'src/order/order.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/common/config/winston.config';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserLoggingInterceptor } from 'src/interceptors/userLogging.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';

import * as path from 'path';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    WinstonModule.forRoot(winstonConfig),
    ServeStaticModule.forRoot(
      {
        rootPath: path.resolve(__dirname, '..', '..', 'pictures/user'),
        serveRoot: '/pictures/user',
      },
      {
        rootPath: path.resolve(__dirname, '..', '..', 'pictures/products'),
        serveRoot: '/pictures/products',
      },
    ),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserLoggingInterceptor,
    },
  ],
})
export class AppModule {}

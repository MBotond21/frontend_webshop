import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, ProductsModule],
})
export class AppModule {}

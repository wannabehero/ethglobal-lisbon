import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { ZkModule } from './zk/zk.module';
import { LoggerMiddleware } from './middlewares/LoggerMiddleware';

@Module({
  imports: [ZkModule],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

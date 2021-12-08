import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import * as redisStore from 'cache-manager-redis-store'
import { AppService } from './app.service';
import { SocketModule } from './modules/socket/socket.module';

@Module({
  imports: [
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: 'redis-10411.c264.ap-south-1-1.ec2.cloud.redislabs.com',
    //   port: 10411,
    //   password: 'socketManagment'
    // }),
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

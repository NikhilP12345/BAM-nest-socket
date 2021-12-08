import { Module } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { RoomService } from './services/room.service';
import { SocketGateway } from './services/socket.service';

@Module({
  providers: [SocketGateway, RoomService, FirebaseService],
})
export class SocketModule {}
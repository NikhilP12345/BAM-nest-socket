import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { SOCKETEVENTLISTENER } from "src/constants";
import { CreateRoomDto, IncreaseRangeDto, IsSafeDto, UpdateCameraPositionDto, UpdateLocationDto } from "../dto/socket.dto";
import { RoomService } from "./room.service";
import { uuid } from "uuidv4";

@WebSocketGateway()
export class SocketGateway {
  constructor(
    private readonly roomService: RoomService
  )
  {}
  @WebSocketServer()
  server;


    @SubscribeMessage(SOCKETEVENTLISTENER.CREATE_ROOM)
    async createRoom(client: any, createRoomDto: CreateRoomDto): Promise<void> {
      try{
        await this.roomService.createRoomToCache(client.id, uuid(), createRoomDto)
      }
      catch(error){
        throw error
      }

    }


    @SubscribeMessage(SOCKETEVENTLISTENER.UPDATE_LOCATION)
    async updateUserLocation(client: any, updateLocationDto: UpdateLocationDto): Promise<void> {
      try{
        await this.roomService.updateLocationToCache(client.id, updateLocationDto)
      }
      catch(error){
        throw error
      }
    }


    @SubscribeMessage(SOCKETEVENTLISTENER.UPDATE_CAMERA_POSITION)
    updateCameraPosition(@MessageBody() message: UpdateCameraPositionDto): void {

    }

    @SubscribeMessage(SOCKETEVENTLISTENER.IS_SAFE)
    iSafe(@MessageBody() isSafeDto: IsSafeDto): void {
        try{
          this.roomService.roomSafe(isSafeDto)
        }
        catch(error){
          throw error;
        }
    }

    @SubscribeMessage(SOCKETEVENTLISTENER.INCREASE_RANGE)
    increaseRange(@MessageBody() message: IncreaseRangeDto): void {
    }
}
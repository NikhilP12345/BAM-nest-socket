import { LocationDto } from "../dto/socket.dto";


export interface ICacheData{
    roomId: string,
    socketId: string,
    type: string,
    location: LocationDto
}
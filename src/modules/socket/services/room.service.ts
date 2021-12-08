import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { CreateRoomDto, IsSafeDto, UpdateLocationDto } from "../dto/socket.dto";
import { ICacheData } from "../interfaces/cache.interface";
import * as Redis from 'ioredis'
import admin from "src/constants/firebase";
import { FirebaseService } from "./firebase.service";


@Injectable()
export class RoomService{
    private db = admin.firestore();
    private redis: any;
    constructor(
        private readonly firebase: FirebaseService
    )
    {
        this.redis = new Redis({
            host: 'redis-10411.c264.ap-south-1-1.ec2.cloud.redislabs.com',
            port: 10411,
            password: 'socketManagment',
            keepAlive: 5
        });
    }

    async createRoomToCache(socketId: string, roomId: string, createRoomDto: CreateRoomDto): Promise<any>{
        try{
            const getCacheUser: ICacheData	= await this.getDataFromCache(createRoomDto.uid)
            if(getCacheUser){
                throw new Error("User already Victim")
            }

            const savedCache: ICacheData = {
                socketId,
                roomId,
                location: createRoomDto.location,
                type: createRoomDto.type
            }

            await this.setDataToCache(createRoomDto.uid, savedCache);
            const fcmTokens: Array<string> = []
            const snapshot = await this.firebase.getUserFromDb();
            snapshot.forEach(doc => {
                if(createRoomDto.uid !== doc.id){
                    const data: any = doc.data();
                    const userFcmToken: Array<string> = Object.values(data.FcmToken);
                    userFcmToken.forEach(val => {
                        fcmTokens.push(val)
                    });
                }
            })


            const userInfo = JSON.stringify({
                name: createRoomDto.name,
                roomId: roomId,
                latitude: createRoomDto.location.latitude,
                longitude: createRoomDto.location.longitude
            });
            const message = {
                notification: {
                    title: 'Help Me!!!',
                    body: `${createRoomDto.name} is stuck and is looking for helpers.\nCan You help him?`
                },
                data: {
                    "click_action": "FLUTTER_NOTIFICATION_CLICK",
                    "sound": "default",
                    'type': 'help',
                    userInfo: userInfo
                },
                // tokens: ['fZ28oUDvT2Wn_ww7Kmwuk3:APA91bGC9WJPHPOtP30oHUK_gpi-_o4Fxs2-g0XncPUO3egp-E_KDr7AUFCHzs95xnnLCJlARoby4F0vtxxQBO6xl1bgovEzTZrW27oe29OHMfpLwREZ0lvHQhckW53x7e96leZEc5P7']
                tokens: fcmTokens,
            };
        
            const res = await admin.messaging().sendMulticast(message)
        }
        catch(error){
            throw error
        }
    }


    async updateLocationToCache(socketId: string, updateLocationDto: UpdateLocationDto){
        try{
            const getCacheUser: ICacheData = await this.getDataFromCache(updateLocationDto.uid);
            if(!getCacheUser){
                throw new Error("User not available in cache") 
            }
            if(getCacheUser.roomId !== updateLocationDto.roomId || getCacheUser.socketId !== socketId){
                throw new Error("User already connected in a different roomId")
            }
            getCacheUser.location = updateLocationDto.location
            await this.setDataToCache(updateLocationDto.uid, getCacheUser);

        }
        catch(error){
            throw error
        }
    }

    async roomSafe(isSafe: IsSafeDto){
        try{
            console.log("hrllo")
            const victim: any = await this.getDataFromCache('*');
            console.log(victim)
            // if(!victim){
            //     throw new Error("Victim is not present")
            // }

        }
        catch(error){
            throw error
        }
    }

    async getDataFromCache(key: string): Promise<any>{
        try{
            const value: string = await this.redis.get(key);
            return JSON.parse(value);
        }
        catch(error){
            throw new Error(`Cant get value from cache`)
        }
    }

    async setDataToCache(key: string, value: any): Promise<void>{
        try{
            await this.redis.set(key, JSON.stringify(value));
        }
        catch(error){
            console.log(error)
            throw new Error('Cant set value to cache')
        }
    }
}
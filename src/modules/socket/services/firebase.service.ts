import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { CreateRoomDto, IsSafeDto, UpdateLocationDto } from "../dto/socket.dto";
import { ICacheData } from "../interfaces/cache.interface";
import * as Redis from 'ioredis'
import admin from "src/constants/firebase";


@Injectable()
export class FirebaseService{
    private db = admin.firestore();
    constructor(
    )
    {}

    async getUserFromDb(): Promise<any>{
        try{
            return await this.db.collection('User').get();
        }
        catch(error){
            throw new Error("Unable to fetch data from user")
        }
    }

    async getUserByUidFromDb(uid: string): Promise<any>{
        try{
            return await this.db.collection('User').doc(uid).get();
        }
        catch(error){
            throw new Error(`Unable to fetch data from ${uid}`)
        }
    }



}
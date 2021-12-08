import { Transform, Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import exp from "constants";
import { isEmpty } from "rxjs";

export class LocationDto{
    @IsNumber()
    @Transform((value)=>Number(value))
    @Type(() => Number)
    latitude: number;

    @IsNumber()
    @Transform((value)=>Number(value))
    @Type(() => Number)
    longitude: number;
}

export class userDto{
    @IsString()
    uid: string

    @IsString()
    roomId: string

    @IsString()
    type: string
}

export class UpdateLocationDto{
    location: LocationDto;

    @IsString()
    uid: string

    @IsString()
    roomId: string

    @IsString()
    type: string
}

export class CreateRoomDto{
    location: LocationDto;

    @IsString()
    name: string

    @IsString()
    uid: string

    @IsString()
    type: string = "victim"
}

export class UpdateCameraPositionDto{
    location: LocationDto;

    @IsNumber()
    @Transform((value)=>Number(value))
    @Type(() => Number)
    zoom: number;
}


export class IsSafeDto{
    @IsString()
    uid: string

    @IsString()
    roomId: string

    @IsString()
    type: string
}


export class IncreaseRangeDto{
    @IsString()
    uid: string

    @IsString()
    roomId: string

    @IsString()
    type: string
}


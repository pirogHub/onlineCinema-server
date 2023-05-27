import { IsArray, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { Types } from "mongoose";


export class GenreIdsDto {
    @IsNotEmpty()
    // @IsString({ each: true })
    // @IsNumber()
    genreIds: Types.ObjectId[]
}
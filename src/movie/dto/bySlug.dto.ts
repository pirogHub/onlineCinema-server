import { IsString } from "class-validator";

export class CreateSlugDto {
    @IsString()
    slug: string
}
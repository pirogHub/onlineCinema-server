import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator"

export class AuthDto {
    @IsEmail()
    email: string

    @MinLength(6, {
        message: 'Password be less then 6 characters'
    })
    @IsString()
    password: string
    @IsOptional()
    @IsBoolean()
    isAdmin?: boolean
}

import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserService } from './user.service';
import { Controller, Query, Delete, Param, HttpCode, Body, Put, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { UserModel } from './user.model';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get('profile')
    @Auth()
    async getProfile(@User('_id') _id: string) {
        return this.userService.byId(_id)
    }

    @UsePipes(new ValidationPipe())
    @Put('profile')
    @HttpCode(200)
    @Auth()
    async updateProfile(
        @User('_id') _id: string,
        @Body() dto: UpdateUserDto) {
        return this.userService.updateProfile(_id, dto)
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth()
    async updateUser(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateProfile(id, dto)
    }

    @Get('profile/favorites')
    @Auth()
    async getFavorites(@User("_id") _id: Types.ObjectId) {
        return this.userService.getFavoriteMovies(_id)
    }

    @Put('profile/favorites')
    @HttpCode(200)
    @Auth()
    async toggleFavorites(@Body("movieId", IdValidationPipe) movieId: Types.ObjectId, @User() user: UserModel) {
        return this.userService.toggleFavorite(movieId, user)
    }


    @Get("count")
    @HttpCode(200)
    @Auth("admin")
    async getUserCount() {


        return this.userService.getCount()
    }

    @Get("")
    @HttpCode(200)
    @Auth("admin")
    async getAllUsers(@Query('searchTerm') searchTerm?: string) {


        return this.userService.getAll()
    }

    @Get(":id")
    @HttpCode(200)
    @Auth("admin")
    async getUser(@Param('id') id: string) {

        return this.userService.byId(id)
    }


    @Delete(':id')
    @HttpCode(200)
    @Auth("admin")
    async deleteUser(
        @Param('id', IdValidationPipe) id: string) {

        return this.userService.delete(id)
    }
}

import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { MovieService } from './movie.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateMovieDto } from './updateMovie.dto';


@Controller('movies')
export class MovieController {
    constructor(
        private readonly movieService: MovieService
    ) { }


    @Get('by-slug/:slug')
    async bySlug(@Param("slug") slug: string) {
        return this.movieService.bySlug(slug)
    }

    @Get('by-actor/:actorId')
    async byActorId(@Param("actorId", IdValidationPipe) actorId: Types.ObjectId) {
        return this.movieService.byActorId(actorId)
    }

    @UsePipes(new ValidationPipe())
    @Post('by-genres')
    @HttpCode(200)
    async byGenres(
        @Body("genreIds") genreIds: Types.ObjectId[]
    ) {

        return this.movieService.byGenres(genreIds)
    }

    @Get('')
    async getAll(@Query("searchTerm") searchTerm?: string) {
        return this.movieService.getAll(searchTerm)
    }

    @Get('most-popular')
    async getMostPopular() {
        return this.movieService.getMostPopular()
    }
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put('update-count-opened')
    async updateCountOpened(
        @Body("slug") slug: string
    ) {
        return this.movieService.updateCountOpened(slug)
    }

    @Get(':id')
    @Auth('admin')
    async getById(@Param('id', IdValidationPipe) id: Types.ObjectId) {
        return this.movieService.byId(id)
    }

    @UsePipes(new ValidationPipe())
    @Post()
    @HttpCode(200)
    @Auth('admin')
    async create() {
        return this.movieService.create()
    }


    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async update(@Param('id') id: Types.ObjectId,
        @Body() dto: UpdateMovieDto) {
        return this.movieService.update(id, dto)
    }


    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async delete(@Param('id', IdValidationPipe) id: Types.ObjectId) {
        return this.movieService.delete(id)
    }

}

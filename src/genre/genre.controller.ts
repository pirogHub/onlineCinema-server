import { Auth } from 'src/auth/decorators/auth.decorator';
import { GenreService } from './genre.service';
import { Controller, Query, Post, Delete, Param, HttpCode, Body, Put, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateGenreDto } from './dto/gente.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';



@Controller('genres')
export class GenreController {
    constructor(
        private readonly genreService: GenreService
    ) { }

    @Get('by-slug/:slug')
    async getBySlug(@Param('slug') slug: string) {
        return this.genreService.bySlug(slug)
    }


    @Get("collections")
    async getCollections() {


        return this.genreService.getCollections()
    }

    @Get("")
    @HttpCode(200)
    async getAll(@Query('searchTerm') searchTerm?: string) {


        return this.genreService.getAll(searchTerm)
    }

    @Get(":id")
    @HttpCode(200)
    @Auth("admin")
    async getById(@Param('id') id: string) {
        return this.genreService.byId(id)
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth("admin")
    async update(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateGenreDto
    ) {
        return this.genreService.update(id, dto)
    }
    @UsePipes(new ValidationPipe())
    @Post()
    @HttpCode(200)
    @Auth("admin")
    async create() {
        return this.genreService.create()
    }


    @Delete(':id')
    @HttpCode(200)
    @Auth("admin")
    async deleteGenre(
        @Param('id', IdValidationPipe) id: string) {

        return this.genreService.delete(id)
    }
}

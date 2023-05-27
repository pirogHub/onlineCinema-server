import { IdValidationPipe } from './../pipes/id.validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActorService } from './actor.service';
import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ActorDto } from './actor.dto';

@Controller('actors')
export class ActorController {
    constructor(
        private readonly actorService: ActorService
    ) { }

    @Get('by-slug/:slug')
    async bySlug(@Param('slug') slug: string) {
        const actor = await this.actorService.bySlug(slug)

        if (!actor) throw new NotFoundException("Actor not found")
        return actor
    }

    @Get("")
    @HttpCode(200)
    async getAll(@Query('searchTerm') searchTerm?: string) {

        return this.actorService.getAll(searchTerm)
    }

    @Get(':id')
    @Auth("admin")
    async get(@Param("id", IdValidationPipe) id: string) {
        return this.actorService.biId(id)
    }

    @UsePipes(new ValidationPipe())
    @Post()
    @HttpCode(200)
    @Auth('admin')
    async create() {
        return this.actorService.create()
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth("admin")
    async update(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: ActorDto
    ) {
        return this.actorService.update(id, dto)
    }

    @Delete(":id")
    @HttpCode(200)
    @Auth("admin")
    async delete(@Param("id", IdValidationPipe) id: string) {
        return this.actorService.delete(id)
    }
}


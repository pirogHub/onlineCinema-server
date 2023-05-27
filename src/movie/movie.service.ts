import { TelegramService } from './../telegram/telegram.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateMovieDto } from './updateMovie.dto';
import { Types } from 'mongoose';
import { CreateSlugDto } from './dto/bySlug.dto';
import { GenreIdsDto } from './dto/genreIds.dto';

@Injectable()
export class MovieService {
    constructor(
        @InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
        private readonly telegramService: TelegramService
    ) { }

    async bySlug(slug: string) {
        const doc = await this.movieModel.findOne({ slug }).populate('actors genres').exec()
        if (!doc) throw new NotFoundException("Movie not found")
        return doc
    }

    async byActorId(actorId: Types.ObjectId) {
        const docs = await this.movieModel.find({ actors: actorId }).exec()
        if (!docs) throw new NotFoundException("Movie not found")
        return docs
    }

    async byGenres(genreIds: Types.ObjectId[]) {

        const docs = await this.movieModel.find({ genres: { $in: genreIds } })
        if (!docs) throw new NotFoundException("Movie not found")
        return docs
    }

    async updateCountOpened(slug: string) {
        const updatedDoc = this.movieModel.findOneAndUpdate(
            { slug },
            { $inc: { countOpened: 1 } }, {
            new: true
        })
            .exec()

        if (!updatedDoc) throw new NotFoundException("Movie not found")
        return updatedDoc
    }

    async getMostPopular() {
        return await this.movieModel.find({ countOpened: { $gt: 0 } }).sort({ countOpened: -1 }).populate("genres").exec()

    }

    async getAll(searchTerm?: string) {
        let options = {}

        if (searchTerm) {
            options = {
                $or: [
                    {
                        title: new RegExp(searchTerm, 'i')
                    }
                ]
            }
        }

        return this.movieModel.find(options)
            .select('-updateAt -__v')
            .sort({
                createdAt: "desc"
            }).populate('actors genres')
            .exec()
    }

    async updateRating(id: Types.ObjectId, newRating: number) {
        return this.movieModel.findByIdAndUpdate(id, {
            rating: newRating
        }, {
            new: true
        }).exec()
    }


    async byId(_id: Types.ObjectId) {
        const doc = await this.movieModel.findById(_id)
        if (!doc) throw new NotFoundException("Movie not found")
        return doc
    }

    async create() {
        const defaultValue: UpdateMovieDto = {
            poster: "",
            bigPoster: "",
            title: "",
            slug: "",
            videoUrl: "",
            genres: [],
            actors: []
        }

        const createdDoc = await this.movieModel.create(defaultValue)

        return createdDoc._id
    }


    async update(_id: Types.ObjectId, dto: UpdateMovieDto) {
        if (!dto.isSendTelegram) {
            await this.sendNotification(dto)
            dto.isSendTelegram = true
        }


        const updatedDoc = this.movieModel.findByIdAndUpdate(_id, dto, {
            new: true
        })

        if (!updatedDoc) throw new NotFoundException("Movie not found")
        return updatedDoc
    }

    async delete(_id: Types.ObjectId) {
        const deletedDoc = await this.movieModel.findByIdAndDelete(_id)
        if (!deletedDoc) throw new NotFoundException("Movie not found")

        return deletedDoc
    }

    async sendNotification(dto: UpdateMovieDto) {
        // if (process.env.NODE_ENV !== "development") 
        // await this.telegramService.sendPhoto(dto.poster)
        await this.telegramService.sendPhoto("https://upload.wikimedia.org/wikipedia/en/9/9f/John_Wick_Keanu.jpeg")

        const msg = `<b>${dto.title}</b>`

        await this.telegramService.sendMessage(msg, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            url: "https://www.wikipedia.org/",
                            text: "Go to watch"
                        }
                    ]
                ]
            }
        })
    }

}

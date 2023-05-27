import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ActorModel } from './actor.model';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {

    constructor(
        @InjectModel(ActorModel) private readonly actorModel: ModelType<ActorModel>
    ) { }


    async bySlug(slug: string) {
        const actor = await this.actorModel.findOne({ slug })
        if (!actor) throw new NotFoundException("Actor not found")
        return actor
    }

    async getAll(searchTerm?: string) {
        let options = {}


        if (searchTerm) {
            options = {
                $or: [
                    {
                        name: new RegExp(searchTerm, 'i')
                    },
                    {
                        slug: new RegExp(searchTerm, 'i')
                    }
                ]
            }
        }
        //aggregation

        return this.actorModel.aggregate()
            .match(options)
            .lookup({
                from: "Movie",
                foreignField: "actors",
                localField: "_id",
                as: 'movies'
            }).addFields({
                countMovies: {
                    $size: '$movies'
                }
            })
            .project({
                __v: 0, // то есть, поле __v нам не нужно
                updatedAt: 0,
                movies: 0
            })
            .sort({
                createdAt: -1///'desc'
            })
            .exec()

    }

    async biId(_id: string) {


        const actor = await this.actorModel.findById(_id)
        if (!actor) throw new NotFoundException("Actor not found")

        return actor
    }


    async create() {
        const defaultValue: ActorDto = {
            name: "",
            slug: "",
            photo: "",
        }

        const actor = await this.actorModel.create(defaultValue)

        return actor._id
    }

    async update(_id: string, dto: ActorDto) {
        const updateDoc = await this.actorModel.findByIdAndUpdate(
            _id,
            dto,
            {
                new: true
            })

        if (!updateDoc) throw new NotFoundException("Actor not found")


        return updateDoc
    }

    async delete(id: string) {
        const deleteDoc = this.actorModel.findByIdAndDelete(id)

        if (!deleteDoc) throw new NotFoundException("Actor not found")

        return deleteDoc
    }

}

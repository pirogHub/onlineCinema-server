import { Auth } from 'src/auth/decorators/auth.decorator';
import { RatingService } from './rating.service';
import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from 'src/user/decorators/user.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { SetRatingDto } from './setRating.dto';

@Controller('ratings')
export class RatingController {
    constructor(private readonly RatingService: RatingService) { }

    @Get(':movieId')
    @Auth()
    async getMovieByUser(
        @Param("movieId", IdValidationPipe) movieId: Types.ObjectId,
        @User('_id') _id: Types.ObjectId
    ) {
        return this.RatingService.getMovieValueByUser(movieId, _id)
    }


    @UsePipes(new ValidationPipe())
    @Post("set-rating")
    @HttpCode(200)
    @Auth()
    async setRating(
        @User("_id", IdValidationPipe) _id: Types.ObjectId,
        @Body() dto: SetRatingDto
    ) {
        ;

        return this.RatingService.setRating(_id, dto)
    }

}

import { Controller, HttpCode, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FilesInterceptor } from "@nestjs/platform-express"
import { BadRequestException } from '@nestjs/common';
@Controller('files')
export class FileController {
    constructor(
        private readonly fileService: FileService
    ) { }

    @Post("")
    @HttpCode(200)
    @Auth("admin")
    @UseInterceptors(FilesInterceptor("files"))
    async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Query("folder") folder?: string) {


        if (!files || !files.length) throw new BadRequestException("files with multipart form data required")

        return this.fileService.saveFiles(files, folder)
    }
}

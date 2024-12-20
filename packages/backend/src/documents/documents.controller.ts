import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Res,
  StreamableFile,
  Header,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { ProcessingStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post(':userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // Generate a unique filename while preserving the original extension
          const uniqueId = uuidv4();
          const ext = extname(file.originalname);
          callback(null, `${uniqueId}${ext}`);
        },
      }),
    })
  )
  async upload(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(pdf|jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const document = await this.documentsService.create(userId, {
      fileName: file.originalname,
      fileType: file.mimetype,
      fileUrl: `/uploads/${file.filename}`,
      sourceType: 'UPLOAD',
    });

    this.documentsService.processDocument(document.id).catch((error) => {
      console.error('Error processing document:', error);
    });

    return document;
  }

  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    return this.documentsService.findByUser(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProcessingStatus,
    @Body('error') error?: string,
  ) {
    return this.documentsService.updateStatus(id, status, error);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Get(':id/download')
  @Header('Content-Disposition', 'attachment')
  async downloadFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const document = await this.documentsService.findOne(id);
    const fileName = document.fileUrl.split('/').pop();
    const filePath = this.documentsService.getFilePath(fileName);

    try {
      const file = createReadStream(filePath);
      res.set({
        'Content-Type': document.fileType,
        'Content-Disposition': `attachment; filename="${document.fileName}"`,
      });
      return new StreamableFile(file);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
} 
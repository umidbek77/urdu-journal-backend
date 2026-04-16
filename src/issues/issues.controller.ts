import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Issues')
@ApiBearerAuth()
@Controller('issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  async createIssue(
    @Body() dto: CreateIssueDto,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    },
  ) {
    return this.issuesService.createIssue(
      dto,
      files.file?.[0],
      files.coverImage?.[0],
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all journal issues' })
  async getIssues() {
    return this.issuesService.getIssues();
  }
}

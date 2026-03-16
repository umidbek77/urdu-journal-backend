import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Issues')
@ApiBearerAuth()
@Controller('issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create journal issue' })
  async createIssue(@Body() dto: CreateIssueDto) {
    return this.issuesService.createIssue(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all journal issues' })
  async getIssues() {
    return this.issuesService.getIssues();
  }
}

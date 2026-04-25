import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Body,
  Post,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateEditorDto } from './dto/update-editor.dto';
import { CreateEditorDto } from './dto/create-editor.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats returned' })
  async dashboard() {
    return this.adminService.dashboardStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('stats/articles-status')
  @ApiOperation({ summary: 'Articles statistics by status' })
  async articleStatusStats() {
    return this.adminService.articleStatusStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('stats/articles-monthly')
  @ApiOperation({ summary: 'Monthly articles statistics' })
  async monthlyArticles() {
    return this.adminService.monthlyArticles();
  }

  @Get('editors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'limit', example: 10 })
  async getEditors(@Query() pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    return this.adminService.getEditors(page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('editors')
  @ApiOperation({ summary: 'Create new editor' })
  @ApiResponse({ status: 201, description: 'Editor created successfully' })
  async createEditor(@Body() body: CreateEditorDto) {
    return this.adminService.createEditor(body);
  }

  @Get('editors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', example: 1 })
  async getEditor(@Param('id') id: string) {
    return this.adminService.getEditor(Number(id));
  }

  @Patch('editors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', example: 1 })
  async updateEditor(@Param('id') id: string, @Body() body: UpdateEditorDto) {
    return this.adminService.updateEditor(Number(id), body);
  }

  @Delete('editors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', example: 1 })
  async deleteEditor(@Param('id') id: string) {
    return this.adminService.deleteEditor(Number(id));
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'limit', example: 10 })
  async getUsers(@Query() pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    return this.adminService.getUsers(page, limit);
  }

  @Patch('articles/:id/assign/:editorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assign article to editor' })
  async assignArticle(
    @Param('id') id: string,
    @Param('editorId') editorId: string,
  ) {
    return this.adminService.assignArticle(Number(id), Number(editorId));
  }

  @Get('articles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all articles with filters' })
  async getAllArticles(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query() pagination?: PaginationDto,
  ) {
    return this.adminService.getAllArticles(
      status,
      category,
      pagination?.page ?? 1,
      pagination?.limit ?? 10,
    );
  }

  @Get('articles/accepted')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async acceptedArticles(@Query() pagination: PaginationDto) {
    return this.adminService.getAcceptedArticles(
      pagination.page ?? 1,
      pagination.limit ?? 10,
    );
  }

  @Get('dashboard/full')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async fullDashboard() {
    return this.adminService.fullDashboard();
  }
}
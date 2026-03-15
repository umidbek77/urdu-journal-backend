import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Body, Post } from '@nestjs/common';
import { UpdateEditorDto } from './dto/update-editor.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('dashboard')
  async dashboard() {
    return this.adminService.dashboardStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('stats/articles-status')
  async articleStatusStats() {
    return this.adminService.articleStatusStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('stats/articles-monthly')
  async monthlyArticles() {
    return this.adminService.monthlyArticles();
  }

  @Get('editors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getEditors(@Query() pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    return this.adminService.getEditors(page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('editors')
  async createEditor(@Body() body) {
    return this.adminService.createEditor(body);
  }

  @Get('editors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getEditor(@Param('id') id: string) {
    return this.adminService.getEditor(id);
  }

  @Patch('editors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateEditor(@Param('id') id: string, @Body() body: UpdateEditorDto) {
    return this.adminService.updateEditor(id, body);
  }

  @Delete('editors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async deleteEditor(@Param('id') id: string) {
    return this.adminService.deleteEditor(id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getUsers(@Query() pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    return this.adminService.getUsers(page, limit);
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { IssuesModule } from './issues/issues.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, AdminModule, UsersModule, ArticlesModule, IssuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
})
export class UsersGraphQLModule {}
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { throwError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(getUsersDto: GetUsersDto): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (getUsersDto.page - 1) * getUsersDto.limit,
      take: getUsersDto.limit,
      order: {id: 'ASC'},
    });
    return { users, total };
  }

  async getTotalCount(): Promise<number> {
    return this.usersRepository.count();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({
      where: { id },
      order: {id: 'ASC'},
    })
  }

  async getDailyUserStats(): Promise<{ date: string; count: number }[]> {
    return this.usersRepository
    .createQueryBuilder('user')
    .select("TO_CHAR(user.createdAt, 'YYYY-MM-DD')", 'date')
    .addSelect('COUNT(*)', 'count')
    .groupBy("TO_CHAR(user.createdAt, 'YYYY-MM-DD')")
    .orderBy('date', 'ASC')
    .getRawMany();
}
}
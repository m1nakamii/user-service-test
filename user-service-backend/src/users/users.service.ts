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

  async findAll(getUsersDto: GetUsersDto) {
  const sortBy = (getUsersDto as any)._sortBy || 'id';
  const order = (getUsersDto as any)._order || 'ASC';

  const [users, total] = await this.usersRepository.findAndCount({
    skip: (getUsersDto.page - 1) * getUsersDto.limit,
    take: getUsersDto.limit,
    order: {
      [sortBy]: order
    }
  });

  return { users, total };
}

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({
      where: { id },
      order: {id: 'ASC'},
    })
  }

  async findAllWithArgs(args: {
    page: number;
    limit: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';}) 
    {
    return this.findAll({
      page: args.page,
      limit: args.limit,
      sortBy: args.sortBy,
      order: args.order
    } as GetUsersDto);
}
}
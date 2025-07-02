import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Users,
  UsersSecondaryData,
  UserAdministratives,
  Drivers,
} from 'src/database';
import { conflictResponse, errorResponse, notFoundResponse } from 'src/utils';
// services
import { UpdateUserDto } from '../dto/';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRespository: Repository<Users>,
  ) {}

  async exec(id: number, updateUserDto: UpdateUserDto) {}
}

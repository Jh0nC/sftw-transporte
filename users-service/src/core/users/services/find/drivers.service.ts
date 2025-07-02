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

@Injectable()
export class FindAllDriversService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRespository: Repository<Users>,
  ) {}

  async exec(pageIndex?: number, limitNumber?: number) {}
}

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
export class FindallUsersByDocumentTypeService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRespository: Repository<Users>,
  ) {}

  async exec(
    documentTypeId: number,
    pageIndex?: number,
    limitNumber?: number,
  ) {}
}

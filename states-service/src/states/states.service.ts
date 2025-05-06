import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Injectable()
export class StatesService {
  create(createStateDto: CreateStateDto) {
    return;
  }

  findAll() {
    return;
  }

  findOne(id: number) {
    return;
  }

  update(id: number, updateStateDto: UpdateStateDto) {
    return;
  }

  remove(id: number) {
    return;
  }
}

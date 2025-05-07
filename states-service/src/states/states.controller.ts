import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { StatesService } from './states.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Post()
  create(@Body() createStateDto: CreateStateDto) {
    return this.statesService.create(createStateDto);
  }

  @Get()
  findAll() {
    return this.statesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.statesService.findOne(id);
  }

  @Get(':name')
  findOneByName(@Param('name') name: string) {
    return this.statesService.findOneByName(name);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateStateDto: UpdateStateDto) {
    return this.statesService.update(id, updateStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.statesService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
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
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.statesService.findAll(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.statesService.findOne(id);
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

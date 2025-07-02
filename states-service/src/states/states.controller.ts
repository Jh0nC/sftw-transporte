import { Controller, Body, Param, Query, Get, Put } from '@nestjs/common';
import { UpdateStateDto } from './dto/update-state.dto';
import {
  FindAllStatesService,
  FindOneStateService,
  UpdateStateService,
} from './services';

@Controller('states')
export class StatesController {
  constructor(
    private readonly findAllStates: FindAllStatesService,
    private readonly findOneState: FindOneStateService,
    private readonly updateState: UpdateStateService,
  ) {}

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllStates.exec(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOneState.exec(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateStateDto: UpdateStateDto) {
    return this.updateState.exec(id, updateStateDto);
  }
}

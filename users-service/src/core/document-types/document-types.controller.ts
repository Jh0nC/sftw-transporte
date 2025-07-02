import { Controller, Get, Body, Param, Query, Put } from '@nestjs/common';
import {
  FindAllDocumentTypesService,
  FindOneDocumentTypeService,
  UpdateDocumentTypeService,
} from './services';
import { UpdateDocumentTypeDto } from './dto/';

@Controller('document-types')
export class DocumentTypesController {
  constructor(
    private readonly findAllDocumentTypes: FindAllDocumentTypesService,
    private readonly findOneDocumentType: FindOneDocumentTypeService,
    private readonly updateDocumentType: UpdateDocumentTypeService,
  ) {}

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageIndex = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.findAllDocumentTypes.exec(pageIndex, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOneDocumentType.exec(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
  ) {
    return this.updateDocumentType.exec(id, updateDocumentTypeDto);
  }
}

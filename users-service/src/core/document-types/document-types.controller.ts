import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document_type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document_type.dto';
import {
  CreateDocumentTypeService,
  FindAllDocumentTypesService,
  FindOneDocumentTypeService,
  UpdateDocumentTypeService,
  DeleteDocumentTypeService,
} from './service';

@Controller('document-types')
export class DocumentTypesController {
  constructor(
    private readonly createDocumentType: CreateDocumentTypeService,
    private readonly findAllDocumentTypes: FindAllDocumentTypesService,
    private readonly findOneDocumentType: FindOneDocumentTypeService,
    private readonly updateDocumentType: UpdateDocumentTypeService,
    private readonly deleteDocumentType: DeleteDocumentTypeService,
  ) {}

  @Post()
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.createDocumentType.exec(createDocumentTypeDto);
  }

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

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.deleteDocumentType.exec(id);
  }
}

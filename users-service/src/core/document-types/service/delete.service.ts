import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypes } from 'src/database';

@Injectable()
export class DeleteDocumentTypeService {
  constructor(
    @InjectRepository(DocumentTypes)
    private readonly documentTypesRepository: Repository<DocumentTypes>,
  ) {}

  async exec(id: number) {}
}

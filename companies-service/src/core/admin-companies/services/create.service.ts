import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminCompanies } from 'src/database';
import { conflictResponse, errorResponse, notFoundResponse } from 'src/utils';
import { StatesService, DocumentTypesService } from 'src/integrations';
import { FindOneCompanyIdentificationTypesService } from 'src/core/company-identification-types/services';
import { CreateAdminCompanyDto } from '../dto';

@Injectable()
export class CreateAdminCompanyService {
  constructor(
    @InjectRepository(AdminCompanies)
    private readonly adminCompaniesRepository: Repository<AdminCompanies>,
    private readonly documentTypesService: DocumentTypesService,
    private readonly statesService: StatesService,
    private readonly findOneCompanyIdentificationType: FindOneCompanyIdentificationTypesService,
  ) {}

  async exec(createAdminCompanyDto: CreateAdminCompanyDto) {
    try {
      const {
        identification_type_id,
        identification_number,
        company_name,
        address,
        phone_number,
        email,
        legal_representative,
        representative_document_type_id,
        representative_document,
      } = createAdminCompanyDto;
      const toCreateAdminCompany: Partial<AdminCompanies> = {};

      const identificationType =
        await this.findOneCompanyIdentificationType.exec(
          identification_type_id,
        );

      if (!identificationType) {
        notFoundResponse(`identification_type_id: ${identification_type_id}`);
      } else {
        toCreateAdminCompany.identification_type = identificationType;
      }

      toCreateAdminCompany.identification_number = identification_number;

      const adminCompanyNameExists =
        await this.adminCompaniesRepository.findOneBy({
          company_name,
        });

      if (adminCompanyNameExists) {
        conflictResponse('company_name', 'already exists');
      } else {
        toCreateAdminCompany.company_name = company_name;
      }

      toCreateAdminCompany.address = address;

      const adminCompanyPhoneNumberExists =
        await this.adminCompaniesRepository.findOneBy({
          phone_number,
        });

      if (adminCompanyPhoneNumberExists) {
        conflictResponse('phone_number', 'already exists');
      } else {
        toCreateAdminCompany.phone_number = phone_number;
      }

      const adminCompanyEmailExists =
        await this.adminCompaniesRepository.findOneBy({
          email,
        });

      if (adminCompanyEmailExists) {
        conflictResponse('email', 'already exists');
      } else {
        toCreateAdminCompany.email = email;
      }

      toCreateAdminCompany.legal_representative = legal_representative;

      const representativeDocumentType =
        await this.documentTypesService.findOne(
          representative_document_type_id,
        );
      if (!representativeDocumentType) {
        notFoundResponse(
          `representative_document_type_id: ${representative_document_type_id}`,
        );
      } else {
        toCreateAdminCompany.representative_document_type =
          representativeDocumentType;
      }

      const adminCompanyRepresentativeDocumentNumberExists =
        await this.adminCompaniesRepository.findOneBy({
          representative_document,
        });

      if (adminCompanyRepresentativeDocumentNumberExists) {
        conflictResponse('representative_document', 'already exists');
      } else {
        toCreateAdminCompany.representative_document = representative_document;
      }

      const defaultAdminCompanyState = await this.statesService.findOne(
        /* 
        * Valor del estado de la empresa por defecto: compañia sin verificacion
        > {company_active, id: 112} 
        */
        112,
      );
      toCreateAdminCompany.state = defaultAdminCompanyState;

      const newAdminCompany =
        this.adminCompaniesRepository.create(toCreateAdminCompany);

      const savedAdminCompany =
        await this.adminCompaniesRepository.save(newAdminCompany);

      const newAdminCompanyWithRelations =
        await this.adminCompaniesRepository.findOne({
          where: { id_admin_company: savedAdminCompany.id_admin_company },
          relations: [
            'identification_type',
            'representative_document_type',
            'state',
          ],
        });

      return newAdminCompanyWithRelations;
    } catch (error) {
      errorResponse(error, 'Error creating admin company');
    }
  }
}

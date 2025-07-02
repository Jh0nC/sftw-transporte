import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { AdminCompanies } from 'src/database';
import {
  conflictResponse,
  errorResponse,
  notFoundResponse,
  emptyDataResponse,
} from 'src/utils';
import { StatesService, DocumentTypesService } from 'src/integrations';
import { FindOneCompanyIdentificationTypesService } from 'src/core/company-identification-types/services';
import { UpdateJsonStringConfigService } from './';
import { UpdateAdminCompanyDto } from '../dto';

@Injectable()
export class UpdateAdminCompanyService {
  constructor(
    @InjectRepository(AdminCompanies)
    private readonly adminCompaniesRepository: Repository<AdminCompanies>,
    private readonly documentTypesService: DocumentTypesService,
    private readonly statesService: StatesService,
    private readonly findOneCompanyIdentificationType: FindOneCompanyIdentificationTypesService,
    private readonly updateJsonStringConfig: UpdateJsonStringConfigService,
  ) {}

  async exec(id: number, updateAdminCompanyDto: UpdateAdminCompanyDto) {
    try {
      const currentAdminCompany = await this.adminCompaniesRepository.findOne({
        where: { id_admin_company: id },
        relations: [
          'identification_type',
          'representative_document_type',
          'state',
        ],
      });

      if (!currentAdminCompany) {
        notFoundResponse(`Admin company with id: ${id}`);
      } else if (
        !currentAdminCompany.state ||
        !currentAdminCompany.identification_type ||
        !currentAdminCompany.representative_document_type
      ) {
        errorResponse(
          'Incomplete admin company data',
          'Internal inconsistence data error',
        );
      }

      if (Object.values(updateAdminCompanyDto).length === 0) {
        emptyDataResponse(String(Object.keys(UpdateAdminCompanyDto)));
      }

      const {
        state_id,
        identification_type_id,
        identification_number,
        company_name,
        address,
        phone_number,
        email,
        representative_document,
        representative_document_type_id,
        legal_representative,
        json_string_config,
      } = updateAdminCompanyDto;

      const toUpdateAdminCompany: Partial<AdminCompanies> = {};

      if (
        identification_type_id &&
        identification_type_id !==
          currentAdminCompany?.identification_type?.id_identification_type
      ) {
        const identificationType =
          await this.findOneCompanyIdentificationType.exec(
            identification_type_id,
          );

        if (identificationType === null || identificationType === undefined) {
          notFoundResponse(`identification_type_id: ${identification_type_id}`);
        } else {
          toUpdateAdminCompany.identification_type = identificationType;
        }
      } else {
        toUpdateAdminCompany.identification_type =
          currentAdminCompany?.identification_type;
      }

      if (company_name && company_name !== currentAdminCompany?.company_name) {
        const adminCompanyNameExists =
          await this.adminCompaniesRepository.findOneBy({
            company_name,
            id_admin_company: Not(id),
          });

        if (
          adminCompanyNameExists &&
          adminCompanyNameExists.id_admin_company !== id
        ) {
          conflictResponse('company_name', 'already exists');
        }
        toUpdateAdminCompany.company_name = company_name;
      } else {
        toUpdateAdminCompany.company_name = currentAdminCompany?.company_name;
      }

      if (phone_number && phone_number !== currentAdminCompany?.phone_number) {
        toUpdateAdminCompany.phone_number = phone_number;
      } else {
        toUpdateAdminCompany.phone_number = currentAdminCompany?.phone_number;
      }

      if (email && email !== currentAdminCompany?.email) {
        const adminCompanyEmailExists =
          await this.adminCompaniesRepository.findOne({
            where: {
              email,
              id_admin_company: Not(id),
            },
          });

        if (
          adminCompanyEmailExists &&
          adminCompanyEmailExists.id_admin_company !== id
        ) {
          conflictResponse('email', 'already exists');
        }
        toUpdateAdminCompany.email = email;
      }

      if (identification_number)
        toUpdateAdminCompany.identification_number = identification_number;

      if (address) toUpdateAdminCompany.address = address;

      if (legal_representative)
        toUpdateAdminCompany.legal_representative = legal_representative;

      if (
        representative_document_type_id &&
        representative_document_type_id !==
          currentAdminCompany?.representative_document_type?.id_document_type
      ) {
        const representativeDocumentType =
          await this.documentTypesService.findOne(
            representative_document_type_id,
          );

        if (!representativeDocumentType) {
          notFoundResponse(
            `representative_document_type_id: ${representative_document_type_id}`,
          );
        } else {
          toUpdateAdminCompany.representative_document_type =
            representativeDocumentType;
        }
      } else {
        toUpdateAdminCompany.representative_document_type =
          currentAdminCompany?.representative_document_type;
      }

      if (
        representative_document &&
        representative_document !== currentAdminCompany?.representative_document
      ) {
        const adminCompanyRepresentativeDocumentNumberExists =
          await this.adminCompaniesRepository.findOneBy({
            representative_document,
            id_admin_company: Not(id),
          });
        if (
          adminCompanyRepresentativeDocumentNumberExists &&
          adminCompanyRepresentativeDocumentNumberExists.id_admin_company !== id
        ) {
          conflictResponse('representative_document', 'already exists');
        }
        toUpdateAdminCompany.representative_document = representative_document;
      } else {
        toUpdateAdminCompany.representative_document =
          currentAdminCompany?.representative_document;
      }

      if (state_id) {
        const newState = await this.statesService.findOne(state_id);

        toUpdateAdminCompany.state = newState;
      } else {
        toUpdateAdminCompany.state = currentAdminCompany?.state;
      }

      if (
        String(json_string_config) &&
        String(json_string_config) !==
          String(currentAdminCompany?.json_string_config)
      ) {
        await this.updateJsonStringConfig.exec(json_string_config);
      } else {
        toUpdateAdminCompany.json_string_config =
          currentAdminCompany?.json_string_config;
      }

      await this.adminCompaniesRepository.update(id, toUpdateAdminCompany);

      const updatedAdminCompany = await this.adminCompaniesRepository.findOne({
        where: { id_admin_company: id },
        relations: [
          'identification_type',
          'representative_document_type',
          'state',
        ],
      });

      return updatedAdminCompany;
    } catch (error) {
      errorResponse(error, 'Error updating admin company');
    }
  }
}

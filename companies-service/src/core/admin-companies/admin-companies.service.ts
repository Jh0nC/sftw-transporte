import { Injectable } from '@nestjs/common';
import { CreateAdminCompanyDto } from './dto/create-admin-company.dto';
import { UpdateAdminCompanyDto } from './dto/update-admin-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdminCompanies,
  CompanyIdentificationType,
  DocumentTypes,
} from 'src/database';
import { CompanyIdentificationTypesService } from 'src/core/index.service';
import { UsersService } from 'src/integrations';
import {
  errorResponse,
  successResponse,
  emptyDataResponse,
  notFoundResponse,
  valueExistValidate,
} from 'src/utils';

@Injectable()
export class AdminCompaniesService {
  constructor(
    @InjectRepository(AdminCompanies)
    private readonly adminCompaniesRepository: Repository<AdminCompanies>,

    private readonly companyIdentificationTypeService: CompanyIdentificationTypesService,

    private readonly usersServiceService: UsersService,
  ) {}

  /*
   * Crea una nueva compañía administradora.

  > Verifica si el tipo de identificación proporcionado existe.
  > Valida si el número de identificación, nombre de la compañía y correo electrónico ya existen en la base de datos.
  > Verifica si el tipo de documento del representante legal proporcionado existe.
  > Valida si el documento del representante legal ya existe en la base de datos.
  > Crea una nueva entidad de compañía administradora con las relaciones correspondientes.
  > Guarda la nueva compañía administradora en la base de datos.
  > Retorna una respuesta de éxito con la información de la nueva compañía administradora.
  > Maneja los errores que puedan ocurrir durante el proceso de creación.
   */
  async create(createAdminCompanyDto: CreateAdminCompanyDto) {
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

      const existIdentificationType =
        await this.companyIdentificationTypeService.findOne(
          identification_type_id,
        );

      if (!existIdentificationType) {
        return notFoundResponse('identification_type_id');
      }

      await valueExistValidate(
        this.adminCompaniesRepository,
        'identification_number',
        identification_number,
      );

      await valueExistValidate(
        this.adminCompaniesRepository,
        'company_name',
        company_name,
      );

      await valueExistValidate(this.adminCompaniesRepository, 'email', email);

      const existDocumentType =
        await this.usersServiceService.findDocumentTypeById(
          representative_document_type_id,
        );

      if (!existDocumentType) {
        return notFoundResponse('representative_document_type_id');
      }

      await valueExistValidate(
        this.adminCompaniesRepository,
        'representative_document',
        representative_document,
      );

      const newAdminCompany = this.adminCompaniesRepository.create({
        identification_type: {
          id_identification_type: identification_type_id,
        },
        identification_number,
        company_name,
        address,
        phone_number,
        email,
        legal_representative,
        representative_document_type: {
          id_document_type: representative_document_type_id,
        },
        representative_document,
      });

      await this.adminCompaniesRepository.save(newAdminCompany);

      return successResponse(
        newAdminCompany,
        'Admin company created successfully',
      );
    } catch (error) {
      return errorResponse(error, 'Error creating admin company');
    }
  }

  /*
   * Obtiene todas las compañías administradoras con soporte para paginación opcional.

  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todas las compañías administradoras sin paginar.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados.
  > Retorna una respuesta de éxito. Si se pagina, incluye los datos de las compañías administradoras y el total de compañías. Si no se pagina, solo incluye el array de compañías.
  > Maneja posibles errores durante el proceso de obtención.
   */
  async findAll(pageIndex?: number, limitNumber?: number): Promise<any> {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const adminCompanies = await this.adminCompaniesRepository.find({
          relations: ['identification_type', 'representative_document_type'],
        });

        return successResponse(
          adminCompanies,
          'Admin companies retrieved successfully',
        );
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [adminCompanies, total] =
          await this.adminCompaniesRepository.findAndCount({
            skip,
            take: limitNumber,
            relations: ['identification_type', 'representative_document_type'],
          });

        return successResponse(
          { data: adminCompanies, total },
          'Paginated admin companies retrieved successfully',
        );
      }
    } catch (error) {
      return errorResponse(error, 'Error retrieving admin companies');
    }
  }

  /*
    * Obtiene una compañía administradora específica por su ID.
  
  > Retorna una respuesta de éxito con la compañía administradora encontrada o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de obtención.
   */
  async findOne(id: number) {
    try {
      const adminCompany = await this.adminCompaniesRepository.findOne({
        where: { id_admin_company: id },
        relations: ['identification_type', 'representative_document_type'],
      });

      if (!adminCompany) {
        return notFoundResponse('id_admin_company');
      }

      return successResponse(
        adminCompany,
        'Admin company retrieved successfully',
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving admin company with id: ${id}`,
      );
    }
  }

  /*
   * Actualiza una compañía administradora existente.

  > Verifica si la compañía administradora con el ID proporcionado existe.
  > Verifica si se proporciona algún atributo para la actualización.
  > Valida si el nuevo número de identificación, nombre de la compañía y correo electrónico ya existen para otra compañía (excluyendo la actual).
  > Verifica si el nuevo tipo de identificación y tipo de documento del representante legal proporcionados existen.
  > Valida si el nuevo documento del representante legal ya existe para otra compañía (excluyendo la actual).
  > Actualiza la entidad de la compañía administradora con los nuevos datos y relaciones.
  > Retorna una respuesta de éxito con la información de la compañía administradora actualizada o una respuesta de "no encontrado" o "datos vacíos" según sea necesario.
  > Maneja los errores que puedan ocurrir durante el proceso de actualización.
   */
  async update(id: number, updateAdminCompanyDto: UpdateAdminCompanyDto) {
    try {
      const existingAdminCompany =
        await this.adminCompaniesRepository.findOneBy({
          id_admin_company: id,
        });

      if (!existingAdminCompany) {
        return notFoundResponse('id_admin_company');
      }

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
      } = updateAdminCompanyDto;

      const partialUpdateAdminCompany: Partial<AdminCompanies> = {};

      if (identification_type_id) {
        const identificationTypeResponse =
          await this.companyIdentificationTypeService.findOne(
            identification_type_id,
          );

        if (identificationTypeResponse) {
          if (
            identificationTypeResponse.statusCode === 200 &&
            'data' in identificationTypeResponse
          ) {
            partialUpdateAdminCompany.identification_type =
              identificationTypeResponse.data as CompanyIdentificationType;
          } else {
            return notFoundResponse('identification_type');
          }
        } else {
          return notFoundResponse('identification_type');
        }
      }

      if (identification_number) {
        await valueExistValidate(
          this.adminCompaniesRepository,
          'identification_number',
          identification_number,
        );

        partialUpdateAdminCompany.identification_number = identification_number;
      }

      if (company_name) {
        await valueExistValidate(
          this.adminCompaniesRepository,
          'company_name',
          company_name,
        );

        partialUpdateAdminCompany.company_name = company_name;
      }

      if (address) {
        partialUpdateAdminCompany.address = address;
      }

      if (phone_number) {
        partialUpdateAdminCompany.phone_number = phone_number;
      }

      if (email) {
        await valueExistValidate(this.adminCompaniesRepository, 'email', email);
        partialUpdateAdminCompany.email = email;
      }

      if (legal_representative) {
        partialUpdateAdminCompany.legal_representative = legal_representative;
      }

      if (representative_document_type_id) {
        const existDocumentType =
          await this.usersServiceService.findDocumentTypeById(
            representative_document_type_id,
          );

        if (!existDocumentType) {
          return notFoundResponse('representative_document_type_id');
        }

        partialUpdateAdminCompany.representative_document_type =
          existDocumentType as DocumentTypes;
      }

      if (representative_document) {
        await valueExistValidate(
          this.adminCompaniesRepository,
          'representative_document',
          representative_document,
        );

        partialUpdateAdminCompany.representative_document =
          representative_document;
      }

      if (Object.keys(partialUpdateAdminCompany).length === 0) {
        return emptyDataResponse(String(Object.keys(partialUpdateAdminCompany)));
      }

      await this.adminCompaniesRepository.update(id, partialUpdateAdminCompany);

      const updatedAdminCompany = await this.adminCompaniesRepository.findOne({
        where: { id_admin_company: id },
        relations: ['identification_type', 'representative_document_type'],
      });

      return successResponse(
        updatedAdminCompany,
        'Admin company updated successfully',
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error updating admin company`,
      );
    }
  }
}

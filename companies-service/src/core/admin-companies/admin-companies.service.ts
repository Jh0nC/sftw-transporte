import { Injectable } from '@nestjs/common';
import { CreateAdminCompanyDto } from './dto/create-admin-company.dto';
import { UpdateAdminCompanyDto } from './dto/update-admin-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdminCompanies,
  CompanyIdentificationType,
  DocumentTypes,
  States,
} from 'src/database';
import { CompanyIdentificationTypesService } from 'src/core/index.service';
import { StatesService, UsersService } from 'src/integrations';
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

    private readonly statesService: StatesService,

    private readonly companyIdentificationTypeService: CompanyIdentificationTypesService,

    private readonly usersService: UsersService,
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

      let identification_type: any;
      if ('data' in existIdentificationType) {
        identification_type =
          existIdentificationType.data as CompanyIdentificationType;
      } else {
        notFoundResponse('identification_type_id');
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

      const existDocumentType = await this.usersService.findDocumentTypeById(
        representative_document_type_id,
      );

      let representative_document_type: any;
      if ('data' in existDocumentType) {
        representative_document_type = existDocumentType.data as DocumentTypes;
      } else {
        notFoundResponse('representative_document_type');
      }

      await valueExistValidate(
        this.adminCompaniesRepository,
        'representative_document',
        representative_document,
      );

      // Valor sin verficar por defecto
      const stateResponse = await this.statesService.findOne(
        /*  
        * Estados disponibles para admin_companies
          > comp_unverified	            :id=13
          > comp_verified_active	      :id=14
          > comp_verified_inactive	    :id=15
          */
        13,
      );

      let defaultState: any;
      if ('data' in stateResponse) {
        defaultState = stateResponse.data as States;
      }

      const newAdminCompany = this.adminCompaniesRepository.create({
        identification_type,
        identification_number,
        company_name,
        address,
        phone_number,
        email,
        legal_representative,
        representative_document_type,
        representative_document,
        state: defaultState,
        json_string_config: null,
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
  async findAll(pageIndex?: number, limitNumber?: number) {
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
        relations: [
          'identification_type',
          'representative_document_type',
          'state',
        ],
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

   */
  async update(id: number, updateAdminCompanyDto: UpdateAdminCompanyDto) {
    return;
  }
}

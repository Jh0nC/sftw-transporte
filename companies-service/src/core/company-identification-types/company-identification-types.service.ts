import { Injectable } from '@nestjs/common';
import { CreateCompanyIdentificationTypeDto } from './dto/create-company-identification-type.dto';
import { UpdateCompanyIdentificationTypeDto } from './dto/update-company-identification-type.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  AdminCompanies,
  ClientCompanies,
  CompanyIdentificationType,
} from 'src/database';
import {
  conflictResponse,
  emptyDataResponse,
  errorResponse,
  notFoundResponse,
  successResponse,
} from 'src/utils';

@Injectable()
export class CompanyIdentificationTypesService {
  constructor(
    @InjectRepository(CompanyIdentificationType)
    private readonly companyIdentificationTypeRepository: Repository<CompanyIdentificationType>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  /*
   * Crea un nuevo tipo de identificación de compañía.

  > Verifica si ya existe un tipo de identificación con el nombre proporcionado antes de crearlo.
  > Verifica si ya existe un tipo de identificación con el nombre corto proporcionado antes de crearlo.
  > Retorna una respuesta de éxito con el nuevo tipo de identificación o una respuesta de conflicto si el nombre o el nombre corto ya existen.
  > Maneja posibles errores durante el proceso de creación.
   */
  async create(
    createCompanyIdentificationTypeDto: CreateCompanyIdentificationTypeDto,
  ) {
    try {
      const { identification_type_name, identification_type_short_name } =
        createCompanyIdentificationTypeDto;

      const identificationTypeNameExist =
        await this.companyIdentificationTypeRepository.findOneBy({
          identification_type_name,
        });

      if (identificationTypeNameExist) {
        return conflictResponse('identification_type_name', 'already exists');
      }

      const identificationTypeShortNameExist =
        await this.companyIdentificationTypeRepository.findOneBy({
          identification_type_short_name,
        });

      if (identificationTypeShortNameExist) {
        return conflictResponse(
          'identification_type_short_name',
          'already exists',
        );
      }

      const newCompanyIdentificationType =
        this.companyIdentificationTypeRepository.create({
          identification_type_name,
          identification_type_short_name,
        });

      await this.companyIdentificationTypeRepository.save(
        newCompanyIdentificationType,
      );

      return successResponse(
        newCompanyIdentificationType,
        'Company identification type created successfully',
      );
    } catch (error) {
      return errorResponse(error, 'Error creating company identification type');
    }
  }

  /*
   * Obtiene todos los tipos de identificación de compañías de la base de datos con soporte para paginación opcional.

  > Si no se proporcionan `pageIndex` o `limitNumber`, retorna todos los tipos de identificación sin paginar.
  > Si se proporcionan `pageIndex` y `limitNumber`, realiza la paginación de los resultados.
  > Retorna una respuesta de éxito. Si se pagina, incluye los datos de los tipos de identificación y el total de tipos de identificación. Si no se pagina, solo incluye el array de tipos de identificación.
  > Maneja posibles errores durante el proceso de obtención.
   */
  async findAll(pageIndex?: number, limitNumber?: number) {
    try {
      if (pageIndex === undefined || limitNumber === undefined) {
        const companyIdentificationTypes =
          await this.companyIdentificationTypeRepository.find();

        return successResponse(
          companyIdentificationTypes,
          'Company identification types retrieved successfully',
        );
      } else {
        const skip = (pageIndex - 1) * limitNumber;

        const [companyIdentificationTypes, total] =
          await this.companyIdentificationTypeRepository.findAndCount({
            skip,
            take: limitNumber,
          });

        return successResponse(
          { data: companyIdentificationTypes, total },
          'Paginated company identification types retrieved successfully',
        );
      }
    } catch (error) {
      return errorResponse(
        error,
        'Error retrieving company identification types',
      );
    }
  }

  /*
   * Obtiene una lista con los IDs y nombres de las compañías administradoras que tienen el tipo de identificación especificado.

  > Realiza una consulta a la base de datos para encontrar las compañías administradoras relacionadas con el tipo de identificación proporcionado.
  > Retorna una respuesta de éxito con un array de objetos que contienen el ID y el nombre de cada compañía administradora.
  > Retorna una respuesta de "no encontrado" si el tipo de identificación no existe.
  > Maneja posibles errores durante el proceso de obtención.
   */
  async findAllAdminNamesWithIdentificationType(id: number) {
    try {
      const identificationTypeExist =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!identificationTypeExist) {
        return notFoundResponse('id_identification_type');
      }

      const adminCompanies = await this.entityManager
        .createQueryBuilder(AdminCompanies, 'admin_company')
        .innerJoin(
          'admin_company.identification_type',
          'identification_type',
          'identification_type.id_identification_type = :id',
          { id },
        )
        .select(['admin_company.id_admin_company', 'admin_company.company_name'])
        .getMany();

      return successResponse(
        adminCompanies,
        `Admin companies with identification type ID ${id} retrieved successfully (Query Builder)`,
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving admin companies with identification type ID ${id} (Query Builder)`,
      );
    }
  }

  /*
   * Obtiene una lista con los IDs y nombres de las compañías cliente que tienen el tipo de identificación especificado.

  > Realiza una consulta a la base de datos para encontrar las compañías cliente relacionadas con el tipo de identificación proporcionado.
  > Retorna una respuesta de éxito con un array de objetos que contienen el ID y el nombre de cada compañía cliente.
  > Retorna una respuesta de "no encontrado" si el tipo de identificación no existe.
  > Maneja posibles errores durante el proceso de obtención.
   */
  async findAllClientsNamesWithIdentificationType(id: number) {
    try {
      const identificationTypeExist =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!identificationTypeExist) {
        return notFoundResponse('id_identification_type');
      }

      const clientCompanies = await this.entityManager
        .createQueryBuilder(ClientCompanies, 'client_company')
        .innerJoin(
          'client_company.identification_type',
          'identification_type',
          'identification_type.id_identification_type = :id',
          { id },
        )
        .select([
          'client_company.id_client_company',
          'client_company.client_company_name',
        ])
        .getMany();

      return successResponse(
        clientCompanies,
        `Client companies with identification type ID ${id} retrieved successfully (Query Builder)`,
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving client companies with identification type ID ${id} (Query Builder)`,
      );
    }
  }

  /*
   * Obtiene un tipo de identificación de compañía específico por su ID.

  > Retorna una respuesta de éxito con el tipo de identificación encontrado o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de obtención.
   */
  async findOne(id: number) {
    try {
      const companyIdentificationType =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!companyIdentificationType) {
        return notFoundResponse('id_identification_type');
      }

      return successResponse(
        companyIdentificationType,
        'Company identification type retrieved successfully',
      );
    } catch (error) {
      return errorResponse(
        error,
        `Error retrieving company identification type`,
      );
    }
  }

  /*
   * Actualiza un tipo de identificación de compañía existente.

  > Verifica si el tipo de identificación con el ID proporcionado existe.
  > Verifica si se proporcionan algún atributo para la actualización.
  > Si se proporciona un nuevo nombre de tipo de identificación, verifica si ya existe un tipo de identificación con ese nombre (excluyendo el tipo de identificación actual que se está actualizando).
  > Si se proporciona un nuevo nombre corto de tipo de identificación, verifica si ya existe un tipo de identificación con ese nombre corto (excluyendo el tipo de identificación actual que se está actualizando).
  > Retorna una respuesta de éxito con el tipo de identificación actualizado o una respuesta de "no encontrado" o "conflicto" según sea necesario.
  > Maneja posibles errores durante el proceso de actualización.
   */
  async update(
    id: number,
    updateCompanyIdentificationTypeDto: UpdateCompanyIdentificationTypeDto,
  ) {
    try {
      const companyIdentificationType =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!companyIdentificationType) {
        return notFoundResponse('id_identification_type');
      }

      const { identification_type_name, identification_type_short_name } =
        updateCompanyIdentificationTypeDto;

      if (!identification_type_name && !identification_type_short_name) {
        emptyDataResponse([
          identification_type_name,
          identification_type_short_name,
        ]);
      }

      if (identification_type_name) {
        const identificationTypeNameExist =
          await this.companyIdentificationTypeRepository.findOneBy({
            identification_type_name,
          });

        if (
          identificationTypeNameExist &&
          identificationTypeNameExist.id_identification_type !== id
        ) {
          return conflictResponse('identification_type_name', 'already exists');
        }
      }

      if (identification_type_short_name) {
        const identificationTypeShortNameExist =
          await this.companyIdentificationTypeRepository.findOneBy({
            identification_type_short_name,
          });

        if (
          identificationTypeShortNameExist &&
          identificationTypeShortNameExist.id_identification_type !== id
        ) {
          return conflictResponse(
            'identification_type_short_name',
            'already exists',
          );
        }
      }

      await this.companyIdentificationTypeRepository.update(id, {
        identification_type_name,
        identification_type_short_name,
      });

      const updatedCompanyIdentificationType =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      return successResponse(
        updatedCompanyIdentificationType,
        'Company identification type updated successfully',
      );
    } catch (error) {
      return errorResponse(error, `Error updating company identification type`);
    }
  }

  /*
   * Elimina un tipo de identificación de compañía por su ID.

  > Verifica si el tipo de identificación con el ID proporcionado existe antes de eliminarlo.
  > Retorna una respuesta de éxito tras la eliminación exitosa o una respuesta de "no encontrado" si el ID no existe.
  > Maneja posibles errores durante el proceso de eliminación.
   */
  async remove(id: number) {
    try {
      const companyIdentificationType =
        await this.companyIdentificationTypeRepository.findOneBy({
          id_identification_type: id,
        });

      if (!companyIdentificationType) {
        return notFoundResponse('id_identification_type');
      }

      await this.companyIdentificationTypeRepository.delete(id);

      return successResponse(
        null,
        'Company identification type deleted successfully',
      );
    } catch (error) {
      return errorResponse(error, `Error deleting company identification type`);
    }
  }
}

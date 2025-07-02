import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { AdminCompanies } from 'src/database';
import {
  errorResponse,
  notFoundResponse,
  conflictResponse,
} from 'src/utils/response.util';
import { BaseIntegrationService } from 'src/integrations/base-integration.service';
import { ExternalServiceErrorData } from 'src/types';

@Injectable()
export class AdminCompaniesService extends BaseIntegrationService {
  constructor(httpService: HttpService) {
    super(
      httpService,
      'companiesServiceUrl',
      'Admin Companies External Service',
    );
  }

  async findOne(id: number): Promise<AdminCompanies | undefined> {
    try {
      const url = `${this.baseUrl}/admin-companies/${id}`;

      const response = await firstValueFrom(
        this.httpService.get<AdminCompanies>(url).pipe(
          catchError((axiosError: AxiosError<ExternalServiceErrorData>) => {
            Logger.error(
              `Error calling external Admin Companies Service [${url}]`,
              axiosError.response?.data || axiosError.message,
              this.serviceName,
            );

            if (axiosError.response?.status === HttpStatus.NOT_FOUND) {
              notFoundResponse(`id_admin_company: ${id}`);
            }

            if (axiosError.response?.status === HttpStatus.CONFLICT) {
              const { attribute, conflict, message } =
                axiosError.response?.data || {};
              conflictResponse(attribute, conflict, message);
            }

            return throwError(() =>
              errorResponse(
                axiosError,
                `Error retrieving admin company from external service: ${this.httpService}`,
              ),
            );
          }),
        ),
      );

      if (response?.data == undefined || response?.data == null) {
        notFoundResponse(`id_admin_company: ${id}`);
      }

      return response.data;
    } catch (error) {
      if (
        error instanceof HttpException ||
        (error instanceof AxiosError && error.response?.status)
      ) {
        throw error;
      }

      errorResponse(
        error,
        'Unexpected error in AdminCompaniesService external call',
      );
    }
  }
}

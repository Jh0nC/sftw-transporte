import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { DocumentTypes } from 'src/database';
import { BaseIntegrationService } from '../base-integration.service';
import { AxiosError } from 'axios';
import { ExternalServiceErrorData } from 'src/types';
import { conflictResponse, errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class DocumentTypesService extends BaseIntegrationService {
  constructor(httpService: HttpService) {
    super(httpService, 'usersServiceUrl', 'Document Types External Service');
  }

  async findOne(id: number): Promise<DocumentTypes | undefined> {
    try {
      const url = `${this.baseUrl}/document-types/${id}`;

      const response = await firstValueFrom(
        this.httpService.get<DocumentTypes>(url).pipe(
          catchError((axiosError: AxiosError<ExternalServiceErrorData>) => {
            Logger.error(
              `Error calling ${this.serviceName} [${url}]`,
              axiosError.response?.data || axiosError.message,
              this.serviceName,
            );

            if (axiosError.response?.status === HttpStatus.NOT_FOUND) {
              notFoundResponse(`id_document_type: ${id}`);
            }

            if (axiosError.response?.status === HttpStatus.CONFLICT) {
              const { attribute, conflict, message } =
                axiosError.response?.data || {};
              conflictResponse(attribute, conflict, message);
            }

            return throwError(() =>
              errorResponse(
                axiosError,
                `Error retrieving document types from ${this.serviceName}: ${this.httpService}`,
              ),
            );
          }),
        ),
      );

      if (response?.data == undefined || response?.data == null) {
        notFoundResponse(`id_document_type: ${id}`);
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

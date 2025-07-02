import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { States } from 'src/database';
import { BaseIntegrationService } from '../base-integration.service';
import { AxiosError } from 'axios';
import { ExternalServiceErrorData } from 'src/types';
import { conflictResponse, errorResponse, notFoundResponse } from 'src/utils';

@Injectable()
export class StatesService extends BaseIntegrationService {
  constructor(httpService: HttpService) {
    super(httpService, 'statesServiceUrl', 'States External Service');
  }

  async findOne(id: number): Promise<States | undefined> {
    try {
      const url = `${this.baseUrl}/states/${id}`;

      const response = await firstValueFrom(
        this.httpService.get<States>(url).pipe(
          catchError((axiosError: AxiosError<ExternalServiceErrorData>) => {
            Logger.error(
              `Error calling external States Service [${url}]`,
              axiosError.response?.data || axiosError.message,
              this.serviceName,
            );

            if (axiosError.response?.status === HttpStatus.NOT_FOUND) {
              notFoundResponse(`id_state: ${id}`);
            }

            if (axiosError.response?.status === HttpStatus.CONFLICT) {
              const { attribute, conflict, message } =
                axiosError.response?.data || {};
              conflictResponse(attribute, conflict, message);
            }

            return throwError(() =>
              errorResponse(
                axiosError,
                `Error retrieving states from external service: ${this.httpService}`,
              ),
            );
          }),
        ),
      );

      if (response?.data == undefined || response?.data == null) {
        notFoundResponse(`id_state: ${id}`);
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

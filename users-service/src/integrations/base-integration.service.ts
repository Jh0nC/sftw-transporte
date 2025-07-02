import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { envVariables } from 'src/config';

@Injectable()
export abstract class BaseIntegrationService {
  protected readonly baseUrl: string;
  protected readonly httpService: HttpService;
  protected readonly serviceName: string;

  /*
    *Constructor de la clase base para servicios de integración.
    > Inicializa el HttpService y la URL base para las llamadas a servicios externos.
      */ /**
    @param httpService El servicio HttpService de NestJS para realizar peticiones HTTP.
    @param serviceUrlEnvKey La clave de la variable de entorno que contiene la URL base del servicio.
    @param serviceName Un nombre descriptivo para el servicio.
    */
  constructor(
    httpService: HttpService,
    serviceUrlEnvKey: keyof typeof envVariables,
    serviceName: string,
  ) {
    this.httpService = httpService;
    this.serviceName = serviceName;
    this.baseUrl = envVariables[serviceUrlEnvKey] as string;

    Logger.log(
      `BaseIntegrationService initialized for ${serviceName} with URL: ${this.baseUrl}`,
      'BaseIntegrationService',
    );
  }
}

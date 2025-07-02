// ? Interfaz para el formato de error del servicio externo
export interface ExternalServiceErrorData {
  statusCode: number;
  message: string;
  error?: string;
  attribute?: string;
  conflict?: string;
}
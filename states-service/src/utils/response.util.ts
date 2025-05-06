import { Logger } from '@nestjs/common';

export const notFoundResponse = (reqAttribute: string) => {
  return {
    statusCode: 404,
    message: `Request data, ${reqAttribute}, was not found`,
    error: 'Not Found',
  };
};

export const errorResponse = (error: any, message?: string) => {
  Logger.error('\nError:', error);
  return {
    statusCode: 500,
    message: message || 'Unexpected error',
    error: error.message || String(error),
  };
};

export const successResponse = (data: any, message?: string) => {
  return {
    statusCode: 200,
    message: message || 'Succes operation',
    data: data,
  };
};

export const conflictResponse = (
  attribute?: string,
  conflict?: string,
  message?: string,
) => {
  Logger.error(
    `: ${attribute || 'Something'} is in conflict: ${conflict || undefined}`,
  );
  return {
    statusCode: 409,
    message: attribute
      ? `Attribute: ${attribute} is generating some conflict`
      : message
        ? message
        : `There's a conflict in the operation. Please review the details.`,
    conflict: conflict || 'Conflict',
  };
};

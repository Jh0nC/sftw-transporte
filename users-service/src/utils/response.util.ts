import { Logger } from '@nestjs/common';

export const notFoundResponse = (reqAttribute: string) => {
  return {
    statusCode: 404,
    message: `Request data, ${reqAttribute}, was not found`,
    error: 'Not Found',
  };
};

export const errorResponse = (error: any, message?: string) => {
  Logger.error(`\nError: ${message || 'Unexpected error'}`, error.stack);
  return {
    statusCode: 500,
    message: message || 'Unexpected error',
    error: error.message || String(error),
  };
};

export const successResponse = (data: any, message?: string) => {
  return {
    statusCode: 200,
    message: message || 'Successful operation',
    data: data,
  };
};

export const conflictResponse = (
  attribute?: string,
  conflict?: string,
  message?: string,
) => {
  Logger.error(
    `Conflict - Attribute: ${attribute || 'N/A'}, Details: ${conflict || 'N/A'}, Message: ${message || 'There\'s a conflict in the operation.'}`,
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

export const emptyDataResponse = (attributes: string | string[]) => {
  const attributesString = Array.isArray(attributes)
    ? attributes.join(', ')
    : attributes;
  return {
    statusCode: 400,
    message: `No valid fields were provided for update. Please include at least one of the following attributes: ${attributesString}`,
    error: 'Bad Request',
  };
};
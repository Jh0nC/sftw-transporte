import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';

export const notFoundResponse = (reqAttribute: string): never => {
  throw new NotFoundException({
    statusCode: 404,
    message: `Request data, ${reqAttribute}, was not found`,
    error: 'Not Found',
  });
};

export const errorResponse = (error: any, message?: string): never => {
  Logger.error(`\nError: ${message || 'Unexpected error'}`, error.stack);

  throw new InternalServerErrorException({
    statusCode: 500,
    message: message || 'Unexpected error',
    error: error.message || String(error),
  });
};

export const conflictResponse = (
  attribute?: string,
  conflict?: string,
  message?: string,
): never => {
  Logger.error(
    `Conflict - Attribute: ${attribute || 'N/A'}, 
    Details: ${conflict || 'N/A'}, 
    Message: ${message || "There's a conflict in the operation."}`,
  );

  throw new ConflictException({
    statusCode: 409,
    message: attribute
      ? `Attribute: ${attribute} is generating some conflict`
      : message
        ? message
        : `There's a conflict in the operation. Please review the details.`,
    conflict: conflict || 'Conflict',
  });
};

export const emptyDataResponse = (attributes: string | string[]): never => {
  const attributesString = Array.isArray(attributes)
    ? attributes.join(', ')
    : attributes;

  throw new BadRequestException({
    statusCode: 400,
    message: `No valid fields were provided for update. Please include at least one of the following attributes: ${attributesString}`,
    error: 'Bad Request',
  });
};

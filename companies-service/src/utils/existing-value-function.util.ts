import { Repository, FindOptionsWhere } from 'typeorm';
import { conflictResponse } from 'src/utils/response.util';

export const valueExistValidate = async <T extends { [key: string]: any }>(
  repository: Repository<T>,
  fieldName: keyof T,
  value: any,
) => {
  const whereCondition: FindOptionsWhere<T> = {
    [fieldName]: value,
  } as FindOptionsWhere<T>;

  const existingRecord = await repository.findOneBy(whereCondition);

  if (existingRecord) {
    return conflictResponse(fieldName as string, 'already exists');
  }

  return null;
};

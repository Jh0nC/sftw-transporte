import { Injectable } from '@nestjs/common';

interface JsonStringConfigParams {}

@Injectable()
export class CreateJsonStringConfigService {
  constructor() {
    /* ... */
  }

  async exec(params: JsonStringConfigParams) {
    /* ... */
  }
}

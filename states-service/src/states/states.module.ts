import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { States } from './entities';
import { StatesController } from './states.controller';
import * as StatesServices from './service';

@Module({
  imports: [TypeOrmModule.forFeature([States])],
  controllers: [StatesController],
  providers: Object.values(StatesServices),
  exports: [TypeOrmModule],
})
export class StatesModule {}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';

import { TravelOrdersService } from '../services';
import {
  CreateTravelOrderDto,
  UpdateTravelOrderDto,
  AssignDriverDto,
  UpdateTrackingDto,
  CompleteStopDto,
  CancelTravelOrderDto,
  SearchTravelOrdersDto,
} from '../dto';

@Controller('travel-orders')
export class TravelOrdersController {
  constructor(private readonly travelOrdersService: TravelOrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTravelOrderDto: CreateTravelOrderDto) {
    return await this.travelOrdersService.create(createTravelOrderDto);
  }

  @Get()
  async findAll(@Query() searchDto: SearchTravelOrdersDto) {
    return await this.travelOrdersService.findAll(searchDto);
  }

  @Get('tracking/:trackingCode')
  async findByTrackingCode(@Param('trackingCode') trackingCode: string) {
    return await this.travelOrdersService.findByTrackingCode(trackingCode);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.travelOrdersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTravelOrderDto: UpdateTravelOrderDto,
  ) {
    return await this.travelOrdersService.update(id, updateTravelOrderDto);
  }

  @Post(':id/assign-driver')
  @HttpCode(HttpStatus.OK)
  async assignDriver(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignDriverDto: AssignDriverDto,
  ) {
    return await this.travelOrdersService.assignDriver(id, assignDriverDto);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  async startOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('driverId', ParseUUIDPipe) driverId: string,
  ) {
    return await this.travelOrdersService.startOrder(id, driverId);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  async completeOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('driverId', ParseUUIDPipe) driverId: string,
  ) {
    return await this.travelOrdersService.completeOrder(id, driverId);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelDto: CancelTravelOrderDto,
    @Body('cancelledBy', ParseUUIDPipe) cancelledBy: string,
  ) {
    return await this.travelOrdersService.cancelOrder(id, cancelDto, cancelledBy);
  }

  @Post(':id/tracking')
  @HttpCode(HttpStatus.OK)
  async updateTracking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() trackingDto: UpdateTrackingDto,
    @Body('driverId') driverId?: string,
  ) {
    await this.travelOrdersService.updateTracking(id, trackingDto, driverId);
    return { message: 'Tracking updated successfully' };
  }

  @Get(':id/tracking')
  async getTracking(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('hours') hours?: number,
  ) {
    return await this.travelOrdersService.getTracking(id, hours);
  }

  @Post(':id/stops/:stopId/arrive')
  @HttpCode(HttpStatus.OK)
  async markStopArrived(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('stopId', ParseUUIDPipe) stopId: string,
  ) {
    return await this.travelOrdersService.markStopArrived(id, stopId);
  }

  @Post(':id/stops/:stopId/complete')
  @HttpCode(HttpStatus.OK)
  async completeStop(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('stopId', ParseUUIDPipe) stopId: string,
    @Body() completeStopDto: CompleteStopDto,
  ) {
    return await this.travelOrdersService.completeStop(id, stopId, completeStopDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.travelOrdersService.remove(id);
  }

  @Get('health')
  async health() {
    return {
      status: 'ok',
      service: 'travel-orders-service',
      timestamp: new Date().toISOString(),
    };
  }
}

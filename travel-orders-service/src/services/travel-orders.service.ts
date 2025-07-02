import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { 
  TravelOrder, 
  TravelOrderStop, 
  TravelOrderTracking,
  TravelOrderStatus,
  StopStatus 
} from '../entities';
import { 
  CreateTravelOrderDto,
  UpdateTravelOrderDto,
  AssignDriverDto,
  UpdateTrackingDto,
  CompleteStopDto,
  CancelTravelOrderDto,
  SearchTravelOrdersDto
} from '../dto';

@Injectable()
export class TravelOrdersService {
  constructor(
    @InjectRepository(TravelOrder)
    private travelOrderRepository: Repository<TravelOrder>,
    @InjectRepository(TravelOrderStop)
    private travelOrderStopRepository: Repository<TravelOrderStop>,
    @InjectRepository(TravelOrderTracking)
    private travelOrderTrackingRepository: Repository<TravelOrderTracking>,
    private httpService: HttpService,
  ) {}

  async create(createTravelOrderDto: CreateTravelOrderDto): Promise<TravelOrder> {
    // Generate order number
    const orderNumber = await this.generateOrderNumber();
    const trackingCode = this.generateTrackingCode();

    // Create travel order
    const travelOrder = this.travelOrderRepository.create({
      ...createTravelOrderDto,
      orderNumber,
      trackingCode,
      status: TravelOrderStatus.PENDING,
    });

    const savedOrder = await this.travelOrderRepository.save(travelOrder);

    // Create stops if provided
    if (createTravelOrderDto.stops && createTravelOrderDto.stops.length > 0) {
      const stops = createTravelOrderDto.stops.map(stop => 
        this.travelOrderStopRepository.create({
          ...stop,
          travelOrderId: savedOrder.id,
          status: StopStatus.PENDING,
        })
      );

      await this.travelOrderStopRepository.save(stops);
    }

    // Return with relations
    return this.findOne(savedOrder.id);
  }

  async findAll(searchDto: SearchTravelOrdersDto = {}): Promise<{ orders: TravelOrder[]; total: number }> {
    const {
      clientId,
      driverId,
      companyId,
      status,
      type,
      startDate,
      endDate,
      orderNumber,
      trackingCode,
      page = 1,
      limit = 10
    } = searchDto;

    const queryBuilder = this.travelOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.stops', 'stops')
      .orderBy('order.createdAt', 'DESC');

    // Apply filters
    if (clientId) {
      queryBuilder.andWhere('order.clientId = :clientId', { clientId });
    }

    if (driverId) {
      queryBuilder.andWhere('order.driverId = :driverId', { driverId });
    }

    if (companyId) {
      queryBuilder.andWhere('order.companyId = :companyId', { companyId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('order.type = :type', { type });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (orderNumber) {
      queryBuilder.andWhere('order.orderNumber ILIKE :orderNumber', {
        orderNumber: `%${orderNumber}%`,
      });
    }

    if (trackingCode) {
      queryBuilder.andWhere('order.trackingCode = :trackingCode', { trackingCode });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return { orders, total };
  }

  async findOne(id: string): Promise<TravelOrder> {
    const order = await this.travelOrderRepository.findOne({
      where: { id },
      relations: ['stops'],
      order: {
        stops: {
          sequence: 'ASC',
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Travel order with ID ${id} not found`);
    }

    return order;
  }

  async findByTrackingCode(trackingCode: string): Promise<TravelOrder> {
    const order = await this.travelOrderRepository.findOne({
      where: { trackingCode },
      relations: ['stops'],
      order: {
        stops: {
          sequence: 'ASC',
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Travel order with tracking code ${trackingCode} not found`);
    }

    return order;
  }

  async update(id: string, updateTravelOrderDto: UpdateTravelOrderDto): Promise<TravelOrder> {
    const order = await this.findOne(id);

    // Check if status transition is valid
    if (updateTravelOrderDto.status) {
      this.validateStatusTransition(order.status, updateTravelOrderDto.status);
    }

    await this.travelOrderRepository.update(id, updateTravelOrderDto);

    return this.findOne(id);
  }

  async assignDriver(id: string, assignDriverDto: AssignDriverDto): Promise<TravelOrder> {
    const order = await this.findOne(id);

    if (order.status !== TravelOrderStatus.PENDING) {
      throw new BadRequestException('Can only assign driver to pending orders');
    }

    // Verify driver exists and is available
    await this.verifyDriverAvailability(assignDriverDto.driverId);

    await this.travelOrderRepository.update(id, {
      driverId: assignDriverDto.driverId,
      vehicleId: assignDriverDto.vehicleId,
      status: TravelOrderStatus.CONFIRMED,
    });

    return this.findOne(id);
  }

  async startOrder(id: string, driverId: string): Promise<TravelOrder> {
    const order = await this.findOne(id);

    if (order.driverId !== driverId) {
      throw new BadRequestException('Order not assigned to this driver');
    }

    if (order.status !== TravelOrderStatus.CONFIRMED) {
      throw new BadRequestException('Order must be confirmed before starting');
    }

    await this.travelOrderRepository.update(id, {
      status: TravelOrderStatus.IN_PROGRESS,
      actualPickupTime: new Date(),
    });

    return this.findOne(id);
  }

  async completeOrder(id: string, driverId: string): Promise<TravelOrder> {
    const order = await this.findOne(id);

    if (order.driverId !== driverId) {
      throw new BadRequestException('Order not assigned to this driver');
    }

    if (order.status !== TravelOrderStatus.IN_PROGRESS) {
      throw new BadRequestException('Order must be in progress to complete');
    }

    // Check if all required stops are completed
    const incompleteStops = order.stops.filter(
      stop => stop.status !== StopStatus.COMPLETED && stop.status !== StopStatus.SKIPPED
    );

    if (incompleteStops.length > 0) {
      throw new BadRequestException('All stops must be completed before finishing the order');
    }

    await this.travelOrderRepository.update(id, {
      status: TravelOrderStatus.COMPLETED,
      actualDeliveryTime: new Date(),
    });

    return this.findOne(id);
  }

  async cancelOrder(id: string, cancelDto: CancelTravelOrderDto, cancelledBy: string): Promise<TravelOrder> {
    const order = await this.findOne(id);

    if (order.status === TravelOrderStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed order');
    }

    if (order.status === TravelOrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    await this.travelOrderRepository.update(id, {
      status: TravelOrderStatus.CANCELLED,
      cancellationReason: cancelDto.reason,
      cancelledAt: new Date(),
      cancelledBy,
    });

    return this.findOne(id);
  }

  async updateTracking(id: string, trackingDto: UpdateTrackingDto, driverId?: string): Promise<void> {
    const order = await this.findOne(id);

    if (driverId && order.driverId !== driverId) {
      throw new BadRequestException('Order not assigned to this driver');
    }

    const tracking = this.travelOrderTrackingRepository.create({
      travelOrderId: id,
      driverId: order.driverId,
      vehicleId: order.vehicleId,
      ...trackingDto,
      timestamp: trackingDto.timestamp || new Date(),
    });

    await this.travelOrderTrackingRepository.save(tracking);
  }

  async getTracking(id: string, hours: number = 24): Promise<TravelOrderTracking[]> {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    return this.travelOrderTrackingRepository.find({
      where: {
        travelOrderId: id,
        timestamp: Between(startTime, new Date()),
      },
      order: {
        timestamp: 'ASC',
      },
    });
  }

  async completeStop(orderId: string, stopId: string, completeStopDto: CompleteStopDto): Promise<TravelOrderStop> {
    const stop = await this.travelOrderStopRepository.findOne({
      where: { id: stopId, travelOrderId: orderId },
    });

    if (!stop) {
      throw new NotFoundException('Stop not found');
    }

    if (stop.status === StopStatus.COMPLETED) {
      throw new BadRequestException('Stop is already completed');
    }

    await this.travelOrderStopRepository.update(stopId, {
      status: StopStatus.COMPLETED,
      completionTime: new Date(),
      ...completeStopDto,
    });

    return this.travelOrderStopRepository.findOne({ where: { id: stopId } });
  }

  async markStopArrived(orderId: string, stopId: string): Promise<TravelOrderStop> {
    const stop = await this.travelOrderStopRepository.findOne({
      where: { id: stopId, travelOrderId: orderId },
    });

    if (!stop) {
      throw new NotFoundException('Stop not found');
    }

    await this.travelOrderStopRepository.update(stopId, {
      status: StopStatus.ARRIVED,
      arrivalTime: new Date(),
    });

    return this.travelOrderStopRepository.findOne({ where: { id: stopId } });
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    
    if (order.status === TravelOrderStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot delete order in progress');
    }

    await this.travelOrderRepository.remove(order);
  }

  // Private helper methods
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const datePrefix = `TO${year}${month}${day}`;
    
    const count = await this.travelOrderRepository.count({
      where: {
        orderNumber: Like(`${datePrefix}%`),
      },
    });

    return `${datePrefix}${(count + 1).toString().padStart(4, '0')}`;
  }

  private generateTrackingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private validateStatusTransition(currentStatus: TravelOrderStatus, newStatus: TravelOrderStatus): void {
    const validTransitions = {
      [TravelOrderStatus.PENDING]: [TravelOrderStatus.CONFIRMED, TravelOrderStatus.CANCELLED],
      [TravelOrderStatus.CONFIRMED]: [TravelOrderStatus.IN_PROGRESS, TravelOrderStatus.CANCELLED],
      [TravelOrderStatus.IN_PROGRESS]: [TravelOrderStatus.COMPLETED, TravelOrderStatus.CANCELLED],
      [TravelOrderStatus.COMPLETED]: [],
      [TravelOrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  private async verifyDriverAvailability(driverId: string): Promise<void> {
    // This would call the users service to verify the driver exists and is available
    // For now, we'll just simulate this check
    try {
      // await this.httpService.get(`${this.configService.get('services.users')}/drivers/${driverId}/availability`);
    } catch (error) {
      throw new BadRequestException('Driver not found or not available');
    }
  }
}

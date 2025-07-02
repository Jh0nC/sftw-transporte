import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { TravelOrderStop } from './travel-order-stop.entity';

export enum TravelOrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TravelOrderType {
  PICKUP_DELIVERY = 'pickup_delivery',
  TRANSPORT = 'transport',
  COURIER = 'courier',
  CARGO = 'cargo',
}

@Entity('travel_orders')
@Index(['status'])
@Index(['clientId'])
@Index(['driverId'])
@Index(['vehicleId'])
@Index(['createdAt'])
export class TravelOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @Column({ name: 'client_id', type: 'uuid' })
  clientId: string;

  @Column({ name: 'driver_id', type: 'uuid', nullable: true })
  driverId: string;

  @Column({ name: 'vehicle_id', type: 'uuid', nullable: true })
  vehicleId: string;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TravelOrderStatus,
    default: TravelOrderStatus.PENDING,
  })
  status: TravelOrderStatus;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TravelOrderType,
    default: TravelOrderType.PICKUP_DELIVERY,
  })
  type: TravelOrderType;

  @Column({ name: 'pickup_address', type: 'text' })
  pickupAddress: string;

  @Column({ name: 'pickup_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  pickupLatitude: number;

  @Column({ name: 'pickup_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  pickupLongitude: number;

  @Column({ name: 'delivery_address', type: 'text' })
  deliveryAddress: string;

  @Column({ name: 'delivery_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  deliveryLatitude: number;

  @Column({ name: 'delivery_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  deliveryLongitude: number;

  @Column({ name: 'scheduled_pickup_time', type: 'timestamp', nullable: true })
  scheduledPickupTime: Date;

  @Column({ name: 'scheduled_delivery_time', type: 'timestamp', nullable: true })
  scheduledDeliveryTime: Date;

  @Column({ name: 'actual_pickup_time', type: 'timestamp', nullable: true })
  actualPickupTime: Date;

  @Column({ name: 'actual_delivery_time', type: 'timestamp', nullable: true })
  actualDeliveryTime: Date;

  @Column({ name: 'estimated_distance_km', type: 'decimal', precision: 8, scale: 2, nullable: true })
  estimatedDistanceKm: number;

  @Column({ name: 'actual_distance_km', type: 'decimal', precision: 8, scale: 2, nullable: true })
  actualDistanceKm: number;

  @Column({ name: 'estimated_duration_minutes', type: 'integer', nullable: true })
  estimatedDurationMinutes: number;

  @Column({ name: 'actual_duration_minutes', type: 'integer', nullable: true })
  actualDurationMinutes: number;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  basePrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'package_description', type: 'text', nullable: true })
  packageDescription: string;

  @Column({ name: 'package_weight_kg', type: 'decimal', precision: 8, scale: 2, nullable: true })
  packageWeightKg: number;

  @Column({ name: 'special_instructions', type: 'text', nullable: true })
  specialInstructions: string;

  @Column({ name: 'client_contact_name', type: 'varchar', length: 100 })
  clientContactName: string;

  @Column({ name: 'client_contact_phone', type: 'varchar', length: 20 })
  clientContactPhone: string;

  @Column({ name: 'recipient_contact_name', type: 'varchar', length: 100, nullable: true })
  recipientContactName: string;

  @Column({ name: 'recipient_contact_phone', type: 'varchar', length: 20, nullable: true })
  recipientContactPhone: string;

  @Column({ name: 'tracking_code', type: 'varchar', length: 50, unique: true, nullable: true })
  trackingCode: string;

  @Column({ name: 'requires_signature', type: 'boolean', default: false })
  requiresSignature: boolean;

  @Column({ name: 'signature_url', type: 'text', nullable: true })
  signatureUrl: string;

  @Column({ name: 'proof_of_delivery_url', type: 'text', nullable: true })
  proofOfDeliveryUrl: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', type: 'uuid', nullable: true })
  cancelledBy: string;

  @OneToMany(() => TravelOrderStop, stop => stop.travelOrder, { cascade: true })
  stops: TravelOrderStop[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

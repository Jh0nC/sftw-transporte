import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { TravelOrder } from './travel-order.entity';

export enum StopType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  WAYPOINT = 'waypoint',
}

export enum StopStatus {
  PENDING = 'pending',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

@Entity('travel_order_stops')
@Index(['travelOrderId'])
@Index(['status'])
@Index(['sequence'])
export class TravelOrderStop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'travel_order_id', type: 'uuid' })
  travelOrderId: string;

  @Column({ name: 'sequence', type: 'integer' })
  sequence: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: StopType,
  })
  type: StopType;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StopStatus,
    default: StopStatus.PENDING,
  })
  status: StopStatus;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ name: 'contact_name', type: 'varchar', length: 100, nullable: true })
  contactName: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ name: 'scheduled_time', type: 'timestamp', nullable: true })
  scheduledTime: Date;

  @Column({ name: 'arrival_time', type: 'timestamp', nullable: true })
  arrivalTime: Date;

  @Column({ name: 'completion_time', type: 'timestamp', nullable: true })
  completionTime: Date;

  @Column({ name: 'estimated_duration_minutes', type: 'integer', nullable: true })
  estimatedDurationMinutes: number;

  @Column({ name: 'actual_duration_minutes', type: 'integer', nullable: true })
  actualDurationMinutes: number;

  @Column({ name: 'instructions', type: 'text', nullable: true })
  instructions: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'signature_required', type: 'boolean', default: false })
  signatureRequired: boolean;

  @Column({ name: 'signature_url', type: 'text', nullable: true })
  signatureUrl: string;

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  photoUrl: string;

  @ManyToOne(() => TravelOrder, travelOrder => travelOrder.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'travel_order_id' })
  travelOrder: TravelOrder;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

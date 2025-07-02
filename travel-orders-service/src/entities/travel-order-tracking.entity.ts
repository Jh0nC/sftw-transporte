import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn,
  Index
} from 'typeorm';

@Entity('travel_order_tracking')
@Index(['travelOrderId'])
@Index(['timestamp'])
export class TravelOrderTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'travel_order_id', type: 'uuid' })
  travelOrderId: string;

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ name: 'altitude', type: 'decimal', precision: 8, scale: 2, nullable: true })
  altitude: number;

  @Column({ name: 'speed_kmh', type: 'decimal', precision: 6, scale: 2, nullable: true })
  speedKmh: number;

  @Column({ name: 'heading', type: 'decimal', precision: 6, scale: 2, nullable: true })
  heading: number;

  @Column({ name: 'accuracy_meters', type: 'decimal', precision: 8, scale: 2, nullable: true })
  accuracyMeters: number;

  @Column({ name: 'timestamp', type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'driver_id', type: 'uuid', nullable: true })
  driverId: string;

  @Column({ name: 'vehicle_id', type: 'uuid', nullable: true })
  vehicleId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

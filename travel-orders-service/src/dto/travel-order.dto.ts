import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsNumber, 
  IsDate, 
  IsBoolean, 
  IsArray, 
  ValidateNested,
  IsUUID,
  Min,
  Max,
  IsEmail,
  IsPhoneNumber,
  IsDecimal
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TravelOrderType, TravelOrderStatus, StopType } from '../entities';

export class CreateTravelOrderStopDto {
  @IsEnum(StopType)
  type: StopType;

  @IsNumber()
  @Min(1)
  sequence: number;

  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  scheduledTime?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedDurationMinutes?: number;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsBoolean()
  signatureRequired?: boolean;
}

export class CreateTravelOrderDto {
  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsUUID()
  driverId?: string;

  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsEnum(TravelOrderType)
  type: TravelOrderType;

  @IsString()
  pickupAddress: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickupLatitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  pickupLongitude?: number;

  @IsString()
  deliveryAddress: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  deliveryLatitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  deliveryLongitude?: number;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  scheduledPickupTime?: Date;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  scheduledDeliveryTime?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  packageDescription?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageWeightKg?: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsString()
  clientContactName: string;

  @IsString()
  clientContactPhone: string;

  @IsOptional()
  @IsString()
  recipientContactName?: string;

  @IsOptional()
  @IsString()
  recipientContactPhone?: string;

  @IsOptional()
  @IsBoolean()
  requiresSignature?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTravelOrderStopDto)
  stops?: CreateTravelOrderStopDto[];
}

export class UpdateTravelOrderDto {
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @IsOptional()
  @IsEnum(TravelOrderStatus)
  status?: TravelOrderStatus;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  scheduledPickupTime?: Date;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  scheduledDeliveryTime?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignDriverDto {
  @IsUUID()
  driverId: string;

  @IsOptional()
  @IsUUID()
  vehicleId?: string;
}

export class UpdateTrackingDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @IsNumber()
  altitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  speedKmh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  heading?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  accuracyMeters?: number;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : new Date())
  @IsDate()
  timestamp?: Date;
}

export class CompleteStopDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  signatureUrl?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class CancelTravelOrderDto {
  @IsString()
  reason: string;
}

export class SearchTravelOrdersDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsEnum(TravelOrderStatus)
  status?: TravelOrderStatus;

  @IsOptional()
  @IsEnum(TravelOrderType)
  type?: TravelOrderType;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsString()
  trackingCode?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

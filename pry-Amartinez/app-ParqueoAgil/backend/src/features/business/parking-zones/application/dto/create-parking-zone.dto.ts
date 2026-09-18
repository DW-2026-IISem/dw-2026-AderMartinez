import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateParkingZoneDto {
  @ApiProperty({ example: 'Zona A - Piso 1' })
  @IsString()
  @IsNotEmpty({ message: 'name es requerido' })
  @MaxLength(150)
  name!: string;

  @ApiProperty({ example: 1, description: 'ID del tipo de vehículo' })
  @IsInt({ message: 'vehicleTypeId debe ser entero' })
  @Min(1, { message: 'vehicleTypeId es requerido' })
  vehicleTypeId!: number;

  @ApiProperty({ example: 20, description: 'Cupos totales de la zona' })
  @IsInt({ message: 'capacity debe ser entero' })
  @Min(1, { message: 'capacity debe ser mayor que 0' })
  capacity!: number;

  @ApiPropertyOptional({ example: 20, description: 'Cupos disponibles (default = capacity)' })
  @IsOptional()
  @IsInt({ message: 'availableSpots debe ser entero' })
  @Min(0, { message: 'availableSpots no puede ser negativo' })
  availableSpots?: number;

  @ApiProperty({ example: 3000, description: 'Tarifa por hora en COP' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'hourlyRate debe ser un número' })
  @IsPositive({ message: 'hourlyRate debe ser mayor que 0' })
  hourlyRate!: number;
}

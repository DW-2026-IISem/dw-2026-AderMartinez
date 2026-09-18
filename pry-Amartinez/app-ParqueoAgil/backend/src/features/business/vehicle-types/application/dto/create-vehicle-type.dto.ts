import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateVehicleTypeDto {
  @ApiProperty({ example: 'Motocicleta' })
  @IsString()
  @IsNotEmpty({ message: 'name es requerido' })
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 1500, description: 'Tarifa por hora en COP' })
  @IsNumber()
  @IsPositive({ message: 'hourlyRate debe ser un número positivo' })
  hourlyRate!: number;

  @ApiPropertyOptional({ example: 'Vehículos de 2 ruedas' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

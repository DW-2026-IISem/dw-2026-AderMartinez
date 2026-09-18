import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 1, description: 'ID del cliente (dueño del vehículo)' })
  @IsInt({ message: 'clientId debe ser entero' })
  @Min(1, { message: 'clientId es requerido' })
  clientId!: number;

  @ApiProperty({ example: 1, description: 'ID de la zona de parqueo' })
  @IsInt({ message: 'parkingZoneId debe ser entero' })
  @Min(1, { message: 'parkingZoneId es requerido' })
  parkingZoneId!: number;

  @ApiPropertyOptional({ example: 0, description: 'Impuesto' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'tax debe ser un número' })
  @Min(0, { message: 'tax no puede ser negativo' })
  tax?: number;

  @ApiPropertyOptional({ example: 0, description: 'Descuentos' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'discounts debe ser un número' })
  @Min(0, { message: 'discounts no puede ser negativo' })
  discounts?: number;
}

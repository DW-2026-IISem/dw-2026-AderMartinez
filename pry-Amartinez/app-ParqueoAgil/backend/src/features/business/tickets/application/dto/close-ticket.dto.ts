import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class CloseTicketDto {
  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'tax debe ser un número' })
  @Min(0, { message: 'tax no puede ser negativo' })
  tax?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'discounts debe ser un número' })
  @Min(0, { message: 'discounts no puede ser negativo' })
  discounts?: number;
}

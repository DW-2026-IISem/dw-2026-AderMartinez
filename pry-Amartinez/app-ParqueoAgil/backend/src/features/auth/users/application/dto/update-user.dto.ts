import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Datos de entrada de `PUT /api/usuarios/:id` (reemplazo completo).
 *
 * Ni `password` ni `status` están aquí a propósito:
 *  - la contraseña tiene su propia operación (`PATCH /api/usuarios/:id/password`);
 *  - el estado solo cambia con el borrado lógico (`/deactivate`).
 */
export class UpdateUserDto {
  @ApiProperty({ example: 'nuevo.usuario' })
  @IsString()
  @IsNotEmpty({ message: 'username es requerido' })
  @MinLength(3)
  @MaxLength(80)
  username!: string;

  @ApiProperty({ example: 'nuevo@parqueoagil.local' })
  @IsEmail({}, { message: 'email debe ser un correo válido' })
  @MaxLength(150)
  email!: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string | null;
}

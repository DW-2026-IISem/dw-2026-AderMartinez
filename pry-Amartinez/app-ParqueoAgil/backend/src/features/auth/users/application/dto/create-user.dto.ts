import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Datos de entrada de `POST /api/usuarios`.
 *
 * `status` es opcional y por defecto `active`. Después de crear el usuario, el
 * estado solo cambia con el borrado lógico.
 */
export class CreateUserDto {
  @ApiProperty({ example: 'nuevo.usuario' })
  @IsString()
  @IsNotEmpty({ message: 'username es requerido' })
  @MinLength(3, { message: 'username debe tener al menos 3 caracteres' })
  @MaxLength(80)
  username!: string;

  @ApiProperty({ example: 'nuevo@parqueoagil.local' })
  @IsEmail({}, { message: 'email debe ser un correo válido' })
  @MaxLength(150)
  email!: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'password debe tener al menos 8 caracteres' })
  @MaxLength(100)
  password!: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string | null;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive'] })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Datos de entrada de `PATCH /api/usuarios/:id/password`.
 *
 * Exige la contraseña **actual** además de la nueva. Es una defensa en
 * profundidad: aunque el RBAC autorice la operación, nadie puede cambiar la
 * credencial de otro usuario sin conocerla.
 */
export class ChangePasswordDto {
  @ApiProperty({ example: 'Seller123!' })
  @IsString()
  @IsNotEmpty({ message: 'current_password es requerido' })
  current_password!: string;

  @ApiProperty({ example: 'Seller456!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'new_password debe tener al menos 8 caracteres' })
  @MaxLength(100)
  new_password!: string;
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  CreateUserDto,
  PatchUserDto,
  UpdateUserDto,
} from '../../../application/dto/index.js';
import { UsersService } from '../../../application/use-cases/users.service.js';

/**
 * Controller del feature Users.
 *
 * Solo HTTP: recibe la petición, delega al service y devuelve la respuesta.
 * El manejo de errores es global (GlobalExceptionFilter).
 *
 * Nota ISS-13: los guards de autenticación y autorización se aplicarán aquí
 * cuando existan. Por ahora los endpoints están abiertos.
 */
@ApiTags('usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // ================== READ ==================
  @Get()
  @ApiOperation({ summary: 'Listar usuarios activos (sin password)' })
  async getAll() {
    const users = await this.service.getAll();
    return { users };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por id' })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.getOne(id);
    return { user };
  }

  // ================== CREATE ==================
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear usuario (password se hashea)' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.service.create(dto);
    return { user };
  }

  // ================== UPDATE ==================
  @Put(':id')
  @ApiOperation({ summary: 'Reemplazar usuario (PUT)' })
  async updatePut(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.service.updatePut(id, dto);
    return { user };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar usuario (PATCH parcial)' })
  async updatePatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchUserDto,
  ) {
    const user = await this.service.updatePatch(id, dto);
    return { user };
  }

  // ================== DELETE ==================
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario (físico)' })
  async deletePhysical(@Param('id', ParseIntPipe) id: number) {
    await this.service.deletePhysical(id);
    return { message: 'Usuario eliminado permanentemente', id };
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar usuario (borrado lógico)' })
  async deleteLogical(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.deleteLogical(id);
    return { message: 'Usuario desactivado (borrado lógico)', user };
  }

  // ================== IDENTIDAD Y PERMISOS ==================
  @Patch(':id/password')
  @ApiOperation({ summary: 'Cambiar contraseña (exige current_password)' })
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.service.changePassword(id, dto);
    return { message: 'Contraseña actualizada', id };
  }

  @Get(':id/permisos')
  @ApiOperation({ summary: 'Permisos efectivos del usuario (ISS-12)' })
  async getEffectivePermissions(@Param('id', ParseIntPipe) id: number) {
    const permissions = await this.service.getEffectivePermissions(id);
    return { permissions };
  }
}

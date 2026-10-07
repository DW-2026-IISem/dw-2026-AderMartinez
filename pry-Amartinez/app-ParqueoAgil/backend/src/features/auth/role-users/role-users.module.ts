import { Module } from '@nestjs/common';
import { ROLE_USER_REPOSITORY } from './domain/interfaces/role-user.repository.js';
import { RoleUserRepository } from './infrastructure/persistence/repositories/role-user.repository.js';
import { RoleUsersSeeder } from './infrastructure/persistence/seeders/role-users.seeder.js';
import { RoleUsersService } from './application/use-cases/role-users.service.js';
import { RoleUsersController } from './presentation/http/controllers/role-users.controller.js';
import { UsersModule } from '../users/users.module.js';
import { RolesModule } from '../roles/roles.module.js';

/**
 * RoleUsersModule — feature RoleUsers completo.
 *
 * Importa UsersModule y RolesModule para poder inyectar USER_REPOSITORY y
 * ROLE_REPOSITORY (exportados por esos módulos) en el service y el seeder.
 */
@Module({
  imports: [UsersModule, RolesModule],
  controllers: [RoleUsersController],
  providers: [
    RoleUsersService,
    RoleUsersSeeder,
    { provide: ROLE_USER_REPOSITORY, useClass: RoleUserRepository },
  ],
  exports: [ROLE_USER_REPOSITORY, RoleUsersSeeder],
})
export class RoleUsersModule {}

import { UserModel } from './users/infrastructure/persistence/models/user.model.js';
import { RoleModel } from './roles/infrastructure/persistence/models/role.model.js';
import { ResourceModel } from './resources/infrastructure/persistence/models/resource.model.js';
import { RoleUserModel } from './role-users/infrastructure/persistence/models/role-user.model.js';
import { ResourceRoleModel } from './resource-roles/infrastructure/persistence/models/resource-role.model.js';
import { RefreshTokenModel } from './refresh-tokens/infrastructure/persistence/models/refresh-token.model.js';

/**
 * Asociaciones de las seis entidades de seguridad.
 *
 * Se declaran en un solo archivo (y no dispersas por feature) porque la
 * autorización es una **cadena** que atraviesa cinco tablas; verla junta hace
 * evidente el camino que recorre la consulta de permisos:
 *
 *   ResourceRole → Role → RoleUser → (filtro por user_id)
 *         │
 *         └───────────► Resource ──► (method, path)
 *
 * Los alias (`as`) son los que usan los `include` de los repositorios RBAC, así
 * que cambiar un alias aquí obliga a revisar las consultas.
 */

// --- La concesión conoce su rol y su recurso (los dos extremos del permiso) ---
ResourceRoleModel.belongsTo(RoleModel, { foreignKey: 'role_id', as: 'role' });
ResourceRoleModel.belongsTo(ResourceModel, {
  foreignKey: 'resource_id',
  as: 'resource',
});
RoleModel.hasMany(ResourceRoleModel, {
  foreignKey: 'role_id',
  as: 'resource_roles',
});
ResourceModel.hasMany(ResourceRoleModel, {
  foreignKey: 'resource_id',
  as: 'resource_roles',
});

// --- La asignación conoce su usuario y su rol (primer eslabón de la cadena) ---
RoleUserModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });
RoleUserModel.belongsTo(RoleModel, { foreignKey: 'role_id', as: 'role' });
UserModel.hasMany(RoleUserModel, { foreignKey: 'user_id', as: 'role_users' });
RoleModel.hasMany(RoleUserModel, { foreignKey: 'role_id', as: 'role_users' });

// --- Las sesiones pertenecen a un usuario ---
RefreshTokenModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });
UserModel.hasMany(RefreshTokenModel, {
  foreignKey: 'user_id',
  as: 'refresh_tokens',
});

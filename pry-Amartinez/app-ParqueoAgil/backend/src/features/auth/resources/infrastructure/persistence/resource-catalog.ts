/**
 * Catálogo de los recursos del sistema ParqueoÁgil (fuente única).
 *
 * Un recurso es un par `(method, path)`; un permiso es la concesión de un
 * recurso a un rol. Este archivo es la definición en código del catálogo que
 * puebla el seeder de `resources` y del que se derivan las concesiones de los
 * roles (`ADMIN` recibe todos; `SELLER`, los marcados con `seller: true`).
 *
 * Composición:
 *
 * | Grupo                                  | Recursos |
 * |----------------------------------------|---------:|
 * | Clients                                | 7 |
 * | VehicleTypes                           | 7 |
 * | ParkingZones                           | 7 |
 * | Tickets                                | 4 |
 * | Usuarios (+ password + permisos)       | 9 |
 * | Roles                                  | 7 |
 * | Recursos                               | 7 |
 * | Asignaciones usuario-rol               | 5 |
 * | Concesiones rol-recurso                | 5 |
 * | **Total**                              | **58** |
 *
 * Nota: las operaciones de sesión (`/api/auth/*`) **no** son recursos RBAC.
 * Son OPEN o JWT: no dependen de la matriz de permisos.
 */
export interface CatalogResource {
  method: string;
  path: string;
  description: string;
  /** `true` si el rol `SELLER` recibe esta concesión. */
  seller?: boolean;
}

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  // ── Clients (7) ───────────────────────────────────────────────
  { method: 'GET', path: '/api/clients', description: 'Listar clientes', seller: true },
  { method: 'GET', path: '/api/clients/:id', description: 'Consultar cliente', seller: true },
  { method: 'POST', path: '/api/clients', description: 'Crear cliente' },
  { method: 'PUT', path: '/api/clients/:id', description: 'Reemplazar cliente' },
  { method: 'PATCH', path: '/api/clients/:id', description: 'Modificar cliente' },
  { method: 'DELETE', path: '/api/clients/:id', description: 'Eliminar cliente' },
  { method: 'PATCH', path: '/api/clients/:id/deactivate', description: 'Desactivar cliente' },

  // ── VehicleTypes (7) ──────────────────────────────────────────
  { method: 'GET', path: '/api/vehicle-types', description: 'Listar tipos de vehículo', seller: true },
  { method: 'GET', path: '/api/vehicle-types/:id', description: 'Consultar tipo de vehículo', seller: true },
  { method: 'POST', path: '/api/vehicle-types', description: 'Crear tipo de vehículo' },
  { method: 'PUT', path: '/api/vehicle-types/:id', description: 'Reemplazar tipo de vehículo' },
  { method: 'PATCH', path: '/api/vehicle-types/:id', description: 'Modificar tipo de vehículo' },
  { method: 'DELETE', path: '/api/vehicle-types/:id', description: 'Eliminar tipo de vehículo' },
  { method: 'PATCH', path: '/api/vehicle-types/:id/deactivate', description: 'Desactivar tipo de vehículo' },

  // ── ParkingZones (7) ──────────────────────────────────────────
  { method: 'GET', path: '/api/parking-zones', description: 'Listar zonas', seller: true },
  { method: 'GET', path: '/api/parking-zones/:id', description: 'Consultar zona', seller: true },
  { method: 'POST', path: '/api/parking-zones', description: 'Crear zona' },
  { method: 'PUT', path: '/api/parking-zones/:id', description: 'Reemplazar zona' },
  { method: 'PATCH', path: '/api/parking-zones/:id', description: 'Modificar zona' },
  { method: 'DELETE', path: '/api/parking-zones/:id', description: 'Eliminar zona' },
  { method: 'PATCH', path: '/api/parking-zones/:id/deactivate', description: 'Desactivar zona' },

  // ── Tickets (4) ───────────────────────────────────────────────
  { method: 'GET', path: '/api/tickets', description: 'Listar tickets', seller: true },
  { method: 'GET', path: '/api/tickets/:id', description: 'Consultar ticket', seller: true },
  { method: 'POST', path: '/api/tickets', description: 'Abrir ticket (entrada)', seller: true },
  { method: 'POST', path: '/api/tickets/:id/close', description: 'Cerrar ticket (salida)', seller: true },

  // ── Usuarios (9) ──────────────────────────────────────────────
  { method: 'GET', path: '/api/usuarios', description: 'Listar usuarios' },
  { method: 'GET', path: '/api/usuarios/:id', description: 'Consultar usuario' },
  { method: 'POST', path: '/api/usuarios', description: 'Crear usuario' },
  { method: 'PUT', path: '/api/usuarios/:id', description: 'Reemplazar usuario' },
  { method: 'PATCH', path: '/api/usuarios/:id', description: 'Modificar usuario' },
  { method: 'DELETE', path: '/api/usuarios/:id', description: 'Eliminar usuario' },
  { method: 'PATCH', path: '/api/usuarios/:id/deactivate', description: 'Desactivar usuario' },
  { method: 'PATCH', path: '/api/usuarios/:id/password', description: 'Cambiar contraseña' },
  { method: 'GET', path: '/api/usuarios/:id/permisos', description: 'Permisos efectivos del usuario' },

  // ── Roles (7) ─────────────────────────────────────────────────
  { method: 'GET', path: '/api/roles', description: 'Listar roles' },
  { method: 'GET', path: '/api/roles/:id', description: 'Consultar rol' },
  { method: 'POST', path: '/api/roles', description: 'Crear rol' },
  { method: 'PUT', path: '/api/roles/:id', description: 'Reemplazar rol' },
  { method: 'PATCH', path: '/api/roles/:id', description: 'Modificar rol' },
  { method: 'DELETE', path: '/api/roles/:id', description: 'Eliminar rol' },
  { method: 'PATCH', path: '/api/roles/:id/deactivate', description: 'Desactivar rol' },

  // ── Recursos (7) ──────────────────────────────────────────────
  { method: 'GET', path: '/api/recursos', description: 'Listar recursos' },
  { method: 'GET', path: '/api/recursos/:id', description: 'Consultar recurso' },
  { method: 'POST', path: '/api/recursos', description: 'Crear recurso' },
  { method: 'PUT', path: '/api/recursos/:id', description: 'Reemplazar recurso' },
  { method: 'PATCH', path: '/api/recursos/:id', description: 'Modificar recurso' },
  { method: 'DELETE', path: '/api/recursos/:id', description: 'Eliminar recurso' },
  { method: 'PATCH', path: '/api/recursos/:id/deactivate', description: 'Desactivar recurso' },

  // ── Asignaciones usuario ↔ rol (5) ────────────────────────────
  { method: 'GET', path: '/api/asignaciones-rol', description: 'Listar asignaciones usuario-rol' },
  { method: 'GET', path: '/api/asignaciones-rol/:id', description: 'Consultar asignación' },
  { method: 'POST', path: '/api/asignaciones-rol', description: 'Asignar rol a usuario' },
  { method: 'PATCH', path: '/api/asignaciones-rol/:id/deactivate', description: 'Retirar rol' },
  { method: 'PATCH', path: '/api/asignaciones-rol/:id/reactivate', description: 'Reactivar rol' },

  // ── Concesiones rol ↔ recurso (5) ─────────────────────────────
  { method: 'GET', path: '/api/concesiones-rol', description: 'Listar concesiones rol-recurso' },
  { method: 'GET', path: '/api/concesiones-rol/:id', description: 'Consultar concesión' },
  { method: 'POST', path: '/api/concesiones-rol', description: 'Conceder recurso a rol' },
  { method: 'PATCH', path: '/api/concesiones-rol/:id/deactivate', description: 'Retirar recurso' },
  { method: 'PATCH', path: '/api/concesiones-rol/:id/reactivate', description: 'Reactivar recurso' },
];

/** Recursos que recibe el rol `SELLER`. Derivado del catálogo, no duplicado. */
export const SELLER_RESOURCES: readonly CatalogResource[] = RESOURCE_CATALOG.filter(
  (resource) => resource.seller === true,
);

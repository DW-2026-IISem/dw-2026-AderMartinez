import type { Request } from 'express';
import { ApplicationException } from '../../common/exceptions/application.exception.js';

/**
 * Identidad resuelta que los Guards de acceso dejan en la petición.
 *
 * Se guarda en `req.auth` (ver ampliación de tipos abajo) y la consumen:
 *  - los controllers que necesitan saber quién llama (`GET /api/auth/perfil`);
 *  - `RolesGuard` / `PermissionsGuard` (ISS-13), para consultar los permisos.
 */
export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  /** Token con el que se autenticó (útil para cerrar la sesión actual). */
  tokenId?: string;
}

/**
 * Devuelve la identidad de la petición o falla con 401.
 */
export function requireAuthUser(req: Request): AuthUser {
  if (!req.auth) {
    throw new ApplicationException(401, 'Authentication required');
  }
  return req.auth;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Identidad resuelta por el Guard de auth. `undefined` = OPEN. */
      auth?: AuthUser;
    }
  }
}

export {};

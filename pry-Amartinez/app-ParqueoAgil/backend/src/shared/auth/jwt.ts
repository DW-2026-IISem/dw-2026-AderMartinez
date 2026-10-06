import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { ApplicationException } from '../../common/exceptions/application.exception.js';

/**
 * Emisión y verificación del **access token** (JWT firmado, HS256).
 *
 * Alineado con RFC 7519, RFC 8725 (Best Current Practices) y RFC 6750.
 *
 * El access token es **autocontenido y no se persiste**: se valida con la firma.
 * La base de datos solo interviene para revalidar que el usuario sigue activo
 * (más adelante) y para los refresh tokens.
 */

const ALGORITHM = 'HS256';

/** Emisor/audiencia del sistema. Sirven para rechazar tokens de otro servicio. */
export const TOKEN_ISSUER = 'app-parqueoagil';
export const TOKEN_AUDIENCE = 'app-parqueoagil-api';

/** Vida útil del access token. Corta por diseño. */
export const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.JWT_ACCESS_TTL ?? 900);

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  username: string;
  jti: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new ApplicationException(
      500,
      'JWT_SECRET no configurado (mínimo 32 caracteres). Ver .env',
    );
  }
  return secret;
}

/** Firma un access token para un usuario. */
export function signAccessToken(user: {
  id: number;
  username: string;
}): { token: string; expiresIn: number } {
  const token = jwt.sign({ username: user.username }, getSecret(), {
    algorithm: ALGORITHM,
    subject: String(user.id),
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    jwtid: randomUUID(),
  });
  return { token, expiresIn: ACCESS_TOKEN_TTL_SECONDS };
}

/**
 * Verifica firma y *claims* y devuelve el payload.
 *
 * Cualquier fallo se traduce a `ApplicationException(401)`.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, getSecret(), {
      algorithms: [ALGORITHM],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      clockTolerance: 5,
    }) as JwtPayload;
  } catch {
    throw new ApplicationException(401, 'Invalid or expired access token');
  }

  if (
    typeof payload.sub !== 'string' ||
    !/^[1-9]\d*$/.test(payload.sub) ||
    typeof payload.jti !== 'string' ||
    payload.jti.length === 0
  ) {
    throw new ApplicationException(401, 'Invalid or expired access token');
  }

  return payload as AccessTokenPayload;
}

/** Extrae el token de `Authorization: Bearer <token>` (RFC 6750). */
export function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, value] = header.split(' ');
  if (!scheme || !value || scheme.toLowerCase() !== 'bearer') return null;
  return value;
}

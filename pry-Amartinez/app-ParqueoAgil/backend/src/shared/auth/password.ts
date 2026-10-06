import { hash, compare } from 'bcrypt';
import { createHash, randomBytes } from 'node:crypto';

/**
 * Derivación y verificación de contraseñas (bcrypt 12 rondas).
 *
 * Se centraliza aquí porque lo usan tres sitios distintos y **debe** usar los
 * mismos parámetros en los tres:
 *  - el hook `beforeCreate/beforeUpdate` del modelo `UserModel`;
 *  - el service de usuarios al cambiar la contraseña;
 *  - el login, que compara la credencial en memoria.
 *
 * Coste 12 rondas: compromiso entre coste de CPU del servidor y coste de
 * fuerza bruta para un atacante que obtuviera el hash.
 */
const SALT_ROUNDS = 12;

/** Devuelve el hash bcrypt de una contraseña en claro. */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, SALT_ROUNDS);
}

/** `true` si la contraseña en claro corresponde al hash almacenado. */
export async function comparePassword(
  plain: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(plain, passwordHash);
}

/**
 * Hash determinista (SHA-256, hex) para credenciales de **alta entropía**.
 * Se usa con los refresh tokens, no con contraseñas.
 */
export function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/** Genera un token opaco no adivinable (URL-safe, 64 bytes ≈ 86 caracteres). */
export function generateOpaqueToken(): string {
  return randomBytes(64).toString('base64url');
}

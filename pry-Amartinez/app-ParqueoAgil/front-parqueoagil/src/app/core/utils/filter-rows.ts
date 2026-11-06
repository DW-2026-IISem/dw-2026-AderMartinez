export function filterRows<T>(
  rows: readonly T[] | null | undefined, // Acepta null por seguridad
  query: string,
  pick: (row: T) => Array<string | number | null | undefined>,
): T[] {
  // Si rows es null o undefined, devolvemos un arreglo vacío
  if (!rows || !Array.isArray(rows)) {
    return [];
  }

  const term = query.trim().toLowerCase();

  if (!term) {
    return [...rows];
  }

  return rows.filter((row) =>
    pick(row).some((value) => (value ?? '').toString().toLowerCase().includes(term)),
  );
}
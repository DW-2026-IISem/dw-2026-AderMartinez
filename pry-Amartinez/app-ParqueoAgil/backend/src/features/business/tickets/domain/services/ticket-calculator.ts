export class TicketCalculator {
  /**
   * Calcula horas transcurridas (redondeo hacia arriba, mínimo 1 hora).
   */
  hoursBetween(entryAt: Date, exitAt: Date): number {
    const ms = exitAt.getTime() - entryAt.getTime();
    if (ms <= 0) return 1;
    const hours = ms / (1000 * 60 * 60);
    return Math.max(1, Math.ceil(hours));
  }

  subtotal(hours: number, hourlyRate: number): number {
    return hours * hourlyRate;
  }

  total(subtotal: number, tax: number, discounts: number): number {
    const t = subtotal + tax - discounts;
    return t < 0 ? 0 : t;
  }
}

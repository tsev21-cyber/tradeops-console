/**
 * Typed domain event bus.
 *
 * This is the seam that lets Phase 1 ship as a modular monolith while staying
 * ready for Phase 2. Modules publish domain events instead of calling each
 * other directly. Phase 1 subscribers are the audit log and the dashboard.
 * Phase 2 modules (signals, notifications, referrals, billing) subscribe to
 * the SAME events — added as new files, with zero changes to Phase 1 code.
 *
 * In production this interface is backed by Redis pub/sub (and later a broker
 * such as NATS/Kafka) when modules are extracted into separate services.
 */

export type DomainEvent =
  | { type: "trade.opened"; ownerId: string; tradeId: string; pair: string }
  | { type: "trade.closed"; ownerId: string; tradeId: string; pnl: number }
  | { type: "portfolio.revalued"; ownerId: string; portfolioId: string; marketValue: number }
  | { type: "exchange.synced"; ownerId: string; exchange: string; discrepancies: number }
  | { type: "exchange.rateLimited"; exchange: string; endpoint: string; retryMs: number }
  | { type: "risk.alert"; ownerId: string; level: "info" | "warn" | "critical"; message: string };

export type EventType = DomainEvent["type"];
type Handler<T extends EventType> = (e: Extract<DomainEvent, { type: T }>) => void;
type AnyHandler = (e: DomainEvent) => void;

class EventBus {
  private handlers = new Map<EventType, Set<AnyHandler>>();

  /** Subscribe to one event type. Returns an unsubscribe function. */
  on<T extends EventType>(type: T, handler: Handler<T>): () => void {
    const set = this.handlers.get(type) ?? new Set<AnyHandler>();
    const wrapped = handler as unknown as AnyHandler;
    set.add(wrapped);
    this.handlers.set(type, set);
    return () => set.delete(wrapped);
  }

  /** Publish an event to every subscriber of its type. */
  emit(event: DomainEvent): void {
    this.handlers.get(event.type)?.forEach((h) => h(event));
  }
}

/** Process-wide singleton (swapped for Redis pub/sub in production). */
export const bus = new EventBus();

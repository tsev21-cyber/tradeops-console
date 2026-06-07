"use client";

import { useEffect, useRef, useState } from "react";

export type ConnState = "connecting" | "live" | "reconnecting" | "offline";

export interface LiveTick {
  price: number;
  prevPrice: number;
}

/**
 * Subscribe to Binance's public miniTicker WebSocket for a set of pairs.
 *
 * Production-grade concerns demonstrated here:
 *   - automatic reconnect with capped exponential backoff
 *   - connection-state surfaced to the UI
 *   - clean teardown on unmount (no leaked sockets)
 *
 * No API key is used — this is the public market stream.
 */
export function useLivePrices(pairs: string[]) {
  const [prices, setPrices] = useState<Record<string, LiveTick>>({});
  const [state, setState] = useState<ConnState>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const closedRef = useRef(false);

  useEffect(() => {
    closedRef.current = false;
    const streams = pairs.map((p) => `${p.toLowerCase()}@miniTicker`).join("/");
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      setState(attemptRef.current === 0 ? "connecting" : "reconnecting");
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        attemptRef.current = 0;
        setState("live");
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          const d = msg?.data;
          if (!d?.s || !d?.c) return;
          const pair = d.s as string;
          const price = Number(d.c);
          setPrices((prev) => ({
            [pair]: { price, prevPrice: prev[pair]?.price ?? price },
            ...prev,
          }));
        } catch {
          /* ignore malformed frame */
        }
      };

      ws.onclose = () => {
        if (closedRef.current) return;
        // Capped exponential backoff: 1s, 2s, 4s, 8s, max 10s.
        const delay = Math.min(1000 * 2 ** attemptRef.current, 10_000);
        attemptRef.current += 1;
        setState("reconnecting");
        reconnectTimer = setTimeout(connect, delay);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      closedRef.current = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
    // Reconnect only when the set of pairs actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs.join(",")]);

  return { prices, state };
}

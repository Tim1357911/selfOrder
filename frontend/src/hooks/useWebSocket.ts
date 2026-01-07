import { useEffect, useRef, useCallback } from 'react';
import type { WebSocketMessage } from '../types';

const WS_URL = `ws://${window.location.hostname}:3001`;

export function useWebSocket(
  type: 'customer' | 'cashier' | 'kitchen',
  orderId?: string,
  onMessage?: (message: WebSocketMessage) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const url = `${WS_URL}?type=${type}${orderId ? `&orderId=${orderId}` : ''}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;
  }, [type, orderId, onMessage]);

  useEffect(() => {
    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return wsRef.current;
}

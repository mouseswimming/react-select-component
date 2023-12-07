import { useEffect, useRef } from "react";

type EventCallback = (event: Event) => void;

export default function useEventListener(
  eventType: string,
  callback: EventCallback,
  element: HTMLElement | Window | Document = window
) {
  const callbackRef = useRef<EventCallback | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;

    const handler = (e: Event) => callbackRef.current?.(e);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}

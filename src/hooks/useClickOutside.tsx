import useEventListener from "./useEventListener";
import { RefObject } from "react";
type EventCallback = (event: Event) => void;

export default function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: EventCallback
) {
  useEventListener(
    "click",
    (e: Event) => {
      if (ref.current == null || ref.current.contains(e.target as Node)) return;
      callback(e);
    },
    document
  );
}

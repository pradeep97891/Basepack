import { useEffect, useRef } from "react";

/**
 * Custom hook to attach an event listener to a specified element.
 * @param eventType - The type of the event to listen for (e.g., 'click', 'keydown').
 * @param callback - The callback function to be executed when the event is triggered.
 * @param element - The target element to attach the event listener to. Defaults to window.
 * @param condition - The listener is added to the element only if this value is true(pass boolean state).
 */
function useEventListener(
  eventType: string | string[],
  callback: (event: Event) => void,
  element: EventTarget | HTMLElement = window,
  condition: Boolean | null = true
) {
  // Create a ref to store the latest callback.
  const callbackRef = useRef(callback);

  // Update the ref whenever the callback changes.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the event listener and clean it up on component unmount.
  useEffect(() => {
    if (element == null || !condition) return;

    const handler = (event: Event) => callbackRef.current(event);

    const eventTypes = Array.isArray(eventType) ? eventType : [eventType];

    eventTypes.forEach((event) => element.addEventListener(event, handler));

    // Clean up event listener(s) on component unmount or when dependencies change.
    return () =>
      eventTypes.forEach((event) =>
        element.removeEventListener(event, handler)
      );
  }, [eventType, element, condition]);
}

export { useEventListener };

/**
 If the callback function is directly used inside the useEffect without useRef, and the callback changes (due to re-renders), 
 the useEffect hook would have to remove the old event listener and add a new one every time the callback changes. 
 This is inefficient and can lead to bugs, especially with frequently changing callbacks.

 By using useRef to store the callback, we ensure that the same event listener is added only once,
 and it always calls the latest version of the callback.
*/

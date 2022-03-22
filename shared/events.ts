interface AnyEvent {
  stopPropagation: () => void;
  preventDefault: () => void;
}

export function handleWithStopPropagation<E extends AnyEvent>(handler?: (event?: E) => void) {
  return function handle(event?: E) {
    event?.stopPropagation?.();

    handler?.(event);
  };
}

export function handleWithPreventDefault<E extends AnyEvent>(handler?: (event: E) => void) {
  return function handle(event: E) {
    event?.preventDefault?.();
    handler?.(event);
  };
}

export function handleWithStopPropagationAndPreventDefault<E extends AnyEvent>(handler?: (event?: E) => void) {
  return function handle(event?: E) {
    event?.stopPropagation?.();
    event?.preventDefault?.();

    handler?.(event);
  };
}
